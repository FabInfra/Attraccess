import { Passkey, PasskeyAuthenticationOptions, PasskeyRegistrationOptions, User } from '@attraccess/database-entities';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  RegistrationResponseJSON,
  verifyRegistrationResponse,
  AuthenticationResponseJSON,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { AppConfigType } from '../../../config/app.config';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WebAuthnService implements OnModuleInit {
  private readonly logger = new Logger(WebAuthnService.name);

  private readonly rpID: string;
  private readonly rpName: string;
  private readonly origin: string;

  public constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PasskeyRegistrationOptions)
    private passkeyRegistrationOptionsRepository: Repository<PasskeyRegistrationOptions>,
    @InjectRepository(Passkey)
    private passkeyRepository: Repository<Passkey>,
    @InjectRepository(PasskeyAuthenticationOptions)
    private passkeyAuthenticationOptionsRepository: Repository<PasskeyAuthenticationOptions>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    const appConfig = this.configService.get<AppConfigType>('app');

    this.rpID = new URL(appConfig.FRONTEND_URL).hostname;
    this.rpName = 'Attraccess';
    this.origin = appConfig.FRONTEND_URL;
  }

  async onModuleInit() {
    // Run initial cleanup when the module initializes
    await this.cleanupOldRegistrationOptions();
    await this.cleanupOldAuthenticationOptions();
  }

  private async getPasskeysOfUser(userId: number) {
    return await this.passkeyRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  public async createRegistrationOptions(user: User) {
    const existingPasskeys = await this.getPasskeysOfUser(user.id);

    const optionsData = await generateRegistrationOptions({
      // support for Firefox <118
      // https://simplewebauthn.dev/docs/packages/server#error-signature-verification-with-public-key-of-kty-okp-is-not-supported-by-this-method
      supportedAlgorithmIDs: [-7, -257],
      rpID: this.rpID,
      rpName: this.rpName,
      userName: user.username,
      attestationType: 'none',
      excludeCredentials: existingPasskeys.map((passkey) => ({
        id: passkey.passKeyId,
        transports: passkey.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    const registrationOptions = this.passkeyRegistrationOptionsRepository.create(
      PasskeyRegistrationOptions.fromData(optionsData, user.id)
    );

    const options = await this.passkeyRegistrationOptionsRepository.save(registrationOptions);

    return {
      registrationId: options.id,
      data: optionsData,
    };
  }

  public async verifyRegistration(
    userId: User['id'],
    registrationId: PasskeyRegistrationOptions['id'],
    data: RegistrationResponseJSON
  ) {
    const registrationOptions = await this.passkeyRegistrationOptionsRepository.findOne({
      where: {
        id: registrationId,
        user: {
          id: userId,
        },
      },
    });

    if (!registrationOptions) {
      throw new Error('Registration options not found');
    }

    const verifiedRegistration = await verifyRegistrationResponse({
      response: data,
      expectedChallenge: registrationOptions.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
    });

    this.logger.debug(verifiedRegistration);

    if (!verifiedRegistration.verified) {
      throw new Error('Registration verification failed');
    }

    const passkey = this.passkeyRepository.create(
      Passkey.fromData(verifiedRegistration.registrationInfo, registrationOptions.userId)
    );

    await this.passkeyRepository.save(passkey);
  }

  public async createAuthenticationOptions(user: User) {
    const existingPasskeys = await this.getPasskeysOfUser(user.id);

    const optionsData = await generateAuthenticationOptions({
      rpID: this.rpID,
      // Require users to use a previously-registered authenticator
      allowCredentials: existingPasskeys.map((passkey) => ({
        id: passkey.passKeyId,
        transports: passkey.transports,
      })),
    });

    const authenticationOptions = this.passkeyAuthenticationOptionsRepository.create(
      PasskeyAuthenticationOptions.fromData(optionsData, user.id)
    );

    const options = await this.passkeyAuthenticationOptionsRepository.save(authenticationOptions);

    return {
      authenticationId: options.id,
      data: optionsData,
    };
  }

  public async verifyAuthentication(
    userId: User['id'],
    authenticationId: PasskeyAuthenticationOptions['id'],
    data: AuthenticationResponseJSON
  ): Promise<boolean> {
    const authenticationOptions = await this.passkeyAuthenticationOptionsRepository.findOne({
      where: {
        id: authenticationId,
      },
    });

    if (!authenticationOptions) {
      throw new Error('Authentication options not found');
    }

    const passkey = await this.passkeyRepository.findOne({
      where: {
        passKeyId: data.id,
        user: {
          id: userId,
        },
      },
    });

    const verifiedAuthentication = await verifyAuthenticationResponse({
      response: data,
      expectedChallenge: authenticationOptions.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
      credential: {
        id: passkey.passKeyId,
        publicKey: new Uint8Array(Buffer.from(passkey.publicKey, 'base64')),
        counter: passkey.counter,
        transports: passkey.transports,
      },
    });

    this.logger.debug(verifiedAuthentication);

    if (!verifiedAuthentication.verified) {
      throw new Error('Authentication verification failed');
    }

    const newCounter = verifiedAuthentication.authenticationInfo.newCounter;

    await this.passkeyRepository.update(passkey.id, {
      counter: newCounter,
    });

    return verifiedAuthentication.verified;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async cleanupOldRegistrationOptions() {
    this.logger.debug('Running cleanup of old registration options');
    const ttl = 5 * 60 * 1000; // 5 minutes
    await this.passkeyRegistrationOptionsRepository
      .createQueryBuilder('registrationOptions')
      .where('registrationOptions.createdAt < :cutoffDate', { cutoffDate: new Date(Date.now() - ttl) })
      .delete()
      .execute();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async cleanupOldAuthenticationOptions() {
    this.logger.debug('Running cleanup of old authentication options');
    const ttl = 5 * 60 * 1000; // 5 minutes
    await this.passkeyAuthenticationOptionsRepository
      .createQueryBuilder('authenticationOptions')
      .where('authenticationOptions.createdAt < :cutoffDate', { cutoffDate: new Date(Date.now() - ttl) })
      .delete()
      .execute();
  }
}
