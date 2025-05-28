import { Test, TestingModule } from '@nestjs/testing';
import { SSOController } from './sso.controller';
import { SSOService } from './sso.service';
import { AuthService } from '../auth.service';
import { SSOProvider, SSOProviderType } from '@attraccess/database-entities';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateSSOProviderDto } from './dto/create-sso-provider.dto';
import { UpdateSSOProviderDto } from './dto/update-sso-provider.dto';

describe('SsoController', () => {
  let controller: SSOController;
  let ssoService: SSOService;

  const mockSSOProvider: SSOProvider = {
    id: 1,
    name: 'Test Provider',
    type: SSOProviderType.OIDC,
    createdAt: new Date(),
    updatedAt: new Date(),
    oidcConfiguration: {
      id: 1,
      ssoProviderId: 1,
      issuer: 'https://test-issuer.com',
      authorizationURL: 'https://test-issuer.com/auth',
      tokenURL: 'https://test-issuer.com/token',
      userInfoURL: 'https://test-issuer.com/userinfo',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      createdAt: new Date(),
      updatedAt: new Date(),
      ssoProvider: null,
    },
  } as SSOProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SSOService,
          useValue: {
            getAllProviders: jest.fn().mockResolvedValue([mockSSOProvider]),
            getProviderById: jest.fn().mockResolvedValue(mockSSOProvider),
            getProviderByTypeAndIdWithConfiguration: jest
              .fn()
              .mockResolvedValue(mockSSOProvider),
            createProvider: jest.fn().mockResolvedValue(mockSSOProvider),
            updateProvider: jest.fn().mockResolvedValue(mockSSOProvider),
            deleteProvider: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'app') {
                return {
                  BASE_URL: 'http://localhost:3000',
                };
              }
              return null;
            }),
          },
        },
      ],
      controllers: [SSOController],
    }).compile();

    controller = module.get<SSOController>(SSOController);
    ssoService = module.get<SSOService>(SSOService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProviders', () => {
    it('should return an array of providers', async () => {
      const result = await controller.getAll();
      expect(result).toEqual([mockSSOProvider]);
      expect(ssoService.getAllProviders).toHaveBeenCalled();
    });
  });

  describe('getProviderById', () => {
    it('should return a single provider', async () => {
      const result = await controller.getOneById('1');
      expect(result).toEqual(mockSSOProvider);
      expect(ssoService.getProviderById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if provider not found', async () => {
      jest
        .spyOn(ssoService, 'getProviderById')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(controller.getOneById('999')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('createProvider', () => {
    it('should create a new provider when user has permission', async () => {
      const createDto: CreateSSOProviderDto = {
        name: 'New Provider',
        type: SSOProviderType.OIDC,
        oidcConfiguration: {
          issuer: 'https://new-issuer.com',
          authorizationURL: 'https://new-issuer.com/auth',
          tokenURL: 'https://new-issuer.com/token',
          userInfoURL: 'https://new-issuer.com/userinfo',
          clientId: 'new-client-id',
          clientSecret: 'new-client-secret',
        },
      };

      const result = await controller.createOne(createDto);

      expect(result).toEqual(mockSSOProvider);
      expect(ssoService.createProvider).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateProvider', () => {
    it('should update a provider when user has permission', async () => {
      const updateDto: UpdateSSOProviderDto = {
        name: 'Updated Provider',
      };

      const result = await controller.updateOne('1', updateDto);

      expect(result).toEqual(mockSSOProvider);
      expect(ssoService.updateProvider).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('deleteProvider', () => {
    it('should delete a provider when user has permission', async () => {
      await controller.deleteOne('1');

      expect(ssoService.deleteProvider).toHaveBeenCalledWith(1);
    });
  });
});
