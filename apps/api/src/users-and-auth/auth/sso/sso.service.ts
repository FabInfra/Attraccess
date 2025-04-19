import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SSOProvider, SSOProviderOIDCConfiguration, SSOProviderType } from '@attraccess/database-entities';
import { CreateSSOProviderDto } from './dto/create-sso-provider.dto';
import { UpdateSSOProviderDto } from './dto/update-sso-provider.dto';
import { SSOProviderNotFoundException } from './errors';

@Injectable()
export class SSOService {
  private readonly logger = new Logger(SSOService.name);

  public constructor(
    @InjectRepository(SSOProvider)
    private ssoProviderRepository: Repository<SSOProvider>,
    @InjectRepository(SSOProviderOIDCConfiguration)
    private oidcConfigRepository: Repository<SSOProviderOIDCConfiguration>
  ) {}

  public async getAllProviders(): Promise<SSOProvider[]> {
    this.logger.debug('Getting all SSO providers.');
    const providers = await this.ssoProviderRepository.find();
    this.logger.debug(`Found ${providers.length} SSO providers.`);
    return providers;
  }

  public async getProviderById(id: number): Promise<SSOProvider> {
    this.logger.debug(`Getting SSO provider by ID: ${id}`);
    const provider = await this.ssoProviderRepository.findOne({
      where: { id },
    });

    if (!provider) {
      this.logger.warn(`SSO provider with ID ${id} not found.`);
      throw new SSOProviderNotFoundException();
    }

    this.logger.debug(`Found SSO provider ID: ${id}`);
    return provider;
  }

  public getProviderByTypeAndIdWithConfiguration(ssoType: SSOProviderType, providerId: number): Promise<SSOProvider> {
    this.logger.debug(`Getting SSO provider by type ${ssoType} and ID ${providerId} with configuration.`);
    const relations = [];

    if (ssoType === SSOProviderType.OIDC) {
      relations.push('oidcConfiguration');
    }

    return this.ssoProviderRepository.findOne({
      where: { type: ssoType, id: providerId },
      relations,
    });
  }

  public async createProvider(createDto: CreateSSOProviderDto): Promise<SSOProvider> {
    const { oidcConfiguration, ...loggableBaseDto } = createDto;
    const loggableOidc = oidcConfiguration ? { ...oidcConfiguration, clientSecret: '[REDACTED]' } : null;
    this.logger.debug(
      `Creating new SSO provider: ${JSON.stringify({ ...loggableBaseDto, oidcConfiguration: loggableOidc })}`
    );

    const newProvider = this.ssoProviderRepository.create({
      name: createDto.name,
      type: createDto.type,
    });

    const savedProvider = await this.ssoProviderRepository.save(newProvider);
    this.logger.log(`Saved base SSO provider with ID: ${savedProvider.id}`);

    if (createDto.type === SSOProviderType.OIDC && createDto.oidcConfiguration) {
      this.logger.debug(`Creating OIDC configuration for provider ID: ${savedProvider.id}`);
      await this.createOIDCConfiguration(savedProvider.id, createDto.oidcConfiguration);
    }

    this.logger.debug(`Fetching newly created provider ${savedProvider.id} with configuration.`);
    return this.getProviderByTypeAndIdWithConfiguration(savedProvider.type, savedProvider.id);
  }

  public async updateProvider(id: number, updateDto: UpdateSSOProviderDto): Promise<SSOProvider> {
    const { oidcConfiguration, ...loggableBaseDto } = updateDto;
    const loggableOidc = oidcConfiguration ? { ...oidcConfiguration, clientSecret: '[REDACTED]' } : null;
    this.logger.debug(
      `Updating SSO provider ID ${id}: ${JSON.stringify({ ...loggableBaseDto, oidcConfiguration: loggableOidc })}`
    );

    const provider = await this.getProviderByTypeAndIdWithConfiguration(SSOProviderType.OIDC, id).catch(
      async () => await this.getProviderById(id)
    );

    Object.assign(provider, loggableBaseDto);

    if (provider.type === SSOProviderType.OIDC && provider.oidcConfiguration && updateDto.oidcConfiguration) {
      this.logger.debug(`Updating OIDC configuration for provider ID: ${id}`);
      await this.updateOIDCConfiguration(provider.oidcConfiguration, updateDto.oidcConfiguration);
    }

    this.logger.debug(`Saving updated provider ID: ${id}`);
    await this.ssoProviderRepository.save(provider);

    this.logger.debug(`Fetching updated provider ${id} with configuration.`);
    return this.getProviderByTypeAndIdWithConfiguration(provider.type, provider.id);
  }

  public async deleteProvider(id: number): Promise<void> {
    this.logger.debug(`Attempting to delete SSO provider with ID: ${id}`);
    await this.getProviderById(id);
    await this.ssoProviderRepository.delete(id);
    this.logger.log(`Successfully deleted SSO provider with ID: ${id}`);
  }

  public async createOIDCConfiguration(
    providerId: number,
    config: {
      issuer: string;
      authorizationURL: string;
      tokenURL: string;
      userInfoURL: string;
      clientId: string;
      clientSecret: string;
    }
  ): Promise<SSOProviderOIDCConfiguration> {
    const { clientSecret, ...loggableConfig } = config;
    this.logger.debug(`Creating OIDC config for provider ${providerId}: ${JSON.stringify(loggableConfig)}`);
    const newConfig = this.oidcConfigRepository.create({
      ...config,
      ssoProviderId: providerId,
    });

    const savedConfig = await this.oidcConfigRepository.save(newConfig);
    this.logger.log(`Successfully created OIDC config ${savedConfig.id} for provider ${providerId}`);
    return savedConfig;
  }

  public async updateOIDCConfiguration(
    existingConfig: SSOProviderOIDCConfiguration,
    updateConfig: Partial<{
      issuer: string;
      authorizationURL: string;
      tokenURL: string;
      userInfoURL: string;
      clientId: string;
      clientSecret: string;
    }>
  ): Promise<SSOProviderOIDCConfiguration> {
    const { clientSecret, ...loggableConfig } = updateConfig;
    this.logger.debug(`Updating OIDC config ID ${existingConfig.id}: ${JSON.stringify(loggableConfig)}`);
    Object.assign(existingConfig, updateConfig);
    const savedConfig = await this.oidcConfigRepository.save(existingConfig);
    this.logger.log(`Successfully updated OIDC config ID ${existingConfig.id}`);
    return savedConfig;
  }
}
