import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { GroupIntroductionService } from './groupIntroduction.service';
import { GroupsService } from '../groups.service';
import { UsersService } from '../../../users-and-auth/users/users.service';
import {
  ResourceIntroduction,
  ResourceIntroductionUser,
  ResourceIntroductionHistoryItem,
  ResourceGroup,
  User,
  SystemPermissions,
  IntroductionHistoryAction,
} from '@attraccess/database-entities';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { GroupNotFoundException } from '../../../exceptions/group.notFound.exception';
import { ResourceIntroductionNotFoundException } from '../../../exceptions/resource.introduction.notFound.exception';
import { UserAlreadyHasIntroductionPermissionException } from './groupIntroduction.service';

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('GroupIntroductionService', () => {
  let service: GroupIntroductionService;
  let groupsService: jest.Mocked<GroupsService>;
  let usersService: jest.Mocked<UsersService>;
  let resourceIntroductionRepository: MockRepository<ResourceIntroduction>;
  let resourceIntroductionUserRepository: MockRepository<ResourceIntroductionUser>;
  let resourceIntroductionHistoryRepository: MockRepository<ResourceIntroductionHistoryItem>;

  const mockGroupId = 1;
  const mockUserId = 10;
  const mockIntroducerUserId = 11;
  const mockReceiverUserId = 12;
  const mockUser = createMock<User>({ id: mockUserId });
  const mockGroup = createMock<ResourceGroup>({
    id: mockGroupId,
    name: 'Test Group',
  });
  const mockAdminUser = createMock<User>({
    id: mockUserId,
    systemPermissions: createMock<SystemPermissions>({
      canManageResources: true,
    }),
  });
  const mockRegularUser = createMock<User>({
    id: mockUserId,
    systemPermissions: createMock<SystemPermissions>({
      canManageResources: false,
    }),
  });
  const mockIntroducerUserPermission = createMock<ResourceIntroductionUser>({
    id: 1,
    resourceGroupId: mockGroupId,
    userId: mockIntroducerUserId,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupIntroductionService,
        {
          provide: GroupsService,
          useValue: createMock<GroupsService>(),
        },
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: getRepositoryToken(ResourceIntroduction),
          useValue: createMock<Repository<ResourceIntroduction>>(),
        },
        {
          provide: getRepositoryToken(ResourceIntroductionUser),
          useValue: createMock<Repository<ResourceIntroductionUser>>(),
        },
        {
          provide: getRepositoryToken(ResourceIntroductionHistoryItem),
          useValue: createMock<Repository<ResourceIntroductionHistoryItem>>(),
        },
      ],
    }).compile();

    service = module.get<GroupIntroductionService>(GroupIntroductionService);
    groupsService = module.get(GroupsService);
    usersService = module.get(UsersService);
    resourceIntroductionRepository = module.get(
      getRepositoryToken(ResourceIntroduction)
    );
    resourceIntroductionUserRepository = module.get(
      getRepositoryToken(ResourceIntroductionUser)
    );
    resourceIntroductionHistoryRepository = module.get(
      getRepositoryToken(ResourceIntroductionHistoryItem)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addIntroducer', () => {
    it('should successfully add a group introducer', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      usersService.findOne.mockResolvedValue(mockUser);
      resourceIntroductionUserRepository.findOne.mockResolvedValue(null);
      resourceIntroductionUserRepository.create.mockImplementation((dto) =>
        createMock<ResourceIntroductionUser>(dto)
      );
      resourceIntroductionUserRepository.save.mockResolvedValue(
        mockIntroducerUserPermission
      );

      const result = await service.addIntroducer(mockGroupId, mockUserId);

      expect(groupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
      expect(usersService.findOne).toHaveBeenCalledWith({ id: mockUserId });
      expect(resourceIntroductionUserRepository.findOne).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId, userId: mockUserId },
      });
      expect(resourceIntroductionUserRepository.create).toHaveBeenCalledWith({
        resourceGroupId: mockGroupId,
        resourceId: null,
        userId: mockUserId,
        grantedAt: expect.any(Date),
      });
      expect(resourceIntroductionUserRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw GroupNotFoundException if group does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(null);

      await expect(
        service.addIntroducer(mockGroupId, mockUserId)
      ).rejects.toThrow(GroupNotFoundException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      usersService.findOne.mockResolvedValue(null);

      await expect(
        service.addIntroducer(mockGroupId, mockUserId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UserAlreadyHasIntroductionPermissionException if permission already exists', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      usersService.findOne.mockResolvedValue(mockUser);
      resourceIntroductionUserRepository.findOne.mockResolvedValue(
        mockIntroducerUserPermission
      );

      await expect(
        service.addIntroducer(mockGroupId, mockUserId)
      ).rejects.toThrow(UserAlreadyHasIntroductionPermissionException);
    });
  });

  describe('canGiveGroupIntroductions', () => {
    it('should return true if user has specific group permission', async () => {
      resourceIntroductionUserRepository.findOne.mockResolvedValue(
        mockIntroducerUserPermission
      );
      usersService.findOne.mockResolvedValue(mockRegularUser);

      const result = await service.canGiveGroupIntroductions(
        mockGroupId,
        mockIntroducerUserId
      );
      expect(result).toBe(true);
      expect(resourceIntroductionUserRepository.findOne).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId, userId: mockIntroducerUserId },
      });
      expect(usersService.findOne).toHaveBeenCalledWith({
        id: mockIntroducerUserId,
      });
    });

    it('should return true if user has system canManageResources permission', async () => {
      resourceIntroductionUserRepository.findOne.mockResolvedValue(null);
      usersService.findOne.mockResolvedValue(mockAdminUser);

      const result = await service.canGiveGroupIntroductions(
        mockGroupId,
        mockUserId
      );
      expect(result).toBe(true);
      expect(resourceIntroductionUserRepository.findOne).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId, userId: mockUserId },
      });
      expect(usersService.findOne).toHaveBeenCalledWith({ id: mockUserId });
    });

    it('should return true if user has both specific and system permissions', async () => {
      resourceIntroductionUserRepository.findOne.mockResolvedValue(
        mockIntroducerUserPermission
      );
      usersService.findOne.mockResolvedValue(mockAdminUser);

      const result = await service.canGiveGroupIntroductions(
        mockGroupId,
        mockIntroducerUserId
      );
      expect(result).toBe(true);
    });

    it('should return false if user has no permissions', async () => {
      resourceIntroductionUserRepository.findOne.mockResolvedValue(null);
      usersService.findOne.mockResolvedValue(mockRegularUser);

      const result = await service.canGiveGroupIntroductions(
        mockGroupId,
        mockUserId
      );
      expect(result).toBe(false);
      expect(resourceIntroductionUserRepository.findOne).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId, userId: mockUserId },
      });
      expect(usersService.findOne).toHaveBeenCalledWith({ id: mockUserId });
    });
  });

  describe('removeIntroducer', () => {
    it('should successfully remove a group introducer permission', async () => {
      const permissionIdToRemove = mockIntroducerUserPermission.id;
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionUserRepository.findOne.mockResolvedValue(
        mockIntroducerUserPermission
      );
      resourceIntroductionUserRepository.delete.mockResolvedValue({
        affected: 1,
        raw: [],
      });

      await service.removeIntroducer(mockGroupId, mockIntroducerUserId);

      expect(groupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
      expect(resourceIntroductionUserRepository.findOne).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId, userId: mockIntroducerUserId },
      });
      expect(resourceIntroductionUserRepository.delete).toHaveBeenCalledWith(
        permissionIdToRemove
      );
    });

    it('should throw GroupNotFoundException if group does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(null);

      await expect(
        service.removeIntroducer(mockGroupId, mockIntroducerUserId)
      ).rejects.toThrow(GroupNotFoundException);
      expect(resourceIntroductionUserRepository.findOne).not.toHaveBeenCalled();
      expect(resourceIntroductionUserRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if introduction permission does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeIntroducer(mockGroupId, mockIntroducerUserId)
      ).rejects.toThrow(NotFoundException);
      expect(resourceIntroductionUserRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException message containing user and group ID if permission does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeIntroducer(mockGroupId, mockIntroducerUserId)
      ).rejects.toThrow(
        `Introduction permission not found for user ${mockIntroducerUserId} in group ${mockGroupId}`
      );
    });
  });

  describe('getGroupIntroducers', () => {
    it('should return a list of group introducers', async () => {
      const mockPermissions = [
        mockIntroducerUserPermission,
        createMock<ResourceIntroductionUser>({
          id: 2,
          resourceGroupId: mockGroupId,
          userId: 99,
        }),
      ];
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionUserRepository.find.mockResolvedValue(
        mockPermissions
      );

      const result = await service.getGroupIntroducers(mockGroupId);

      expect(groupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
      expect(resourceIntroductionUserRepository.find).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId },
        relations: ['user', 'resourceGroup'],
      });
      expect(result).toEqual(mockPermissions);
    });

    it('should throw GroupNotFoundException if group does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(null);

      await expect(service.getGroupIntroducers(mockGroupId)).rejects.toThrow(
        GroupNotFoundException
      );
      expect(resourceIntroductionUserRepository.find).not.toHaveBeenCalled();
    });

    it('should return an empty array if no introducers are found', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionUserRepository.find.mockResolvedValue([]);

      const result = await service.getGroupIntroducers(mockGroupId);

      expect(groupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
      expect(resourceIntroductionUserRepository.find).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId },
        relations: ['user', 'resourceGroup'],
      });
      expect(result).toEqual([]);
    });
  });

  describe('createIntroduction', () => {
    let mockIntroduction: ResourceIntroduction;

    beforeEach(() => {
      mockIntroduction = createMock<ResourceIntroduction>({
        id: 100,
        resourceGroupId: mockGroupId,
        resourceId: null,
        tutorUserId: mockIntroducerUserId,
        receiverUserId: mockReceiverUserId,
        completedAt: new Date(),
        createdAt: new Date(),
      });

      jest.spyOn(service, 'canGiveGroupIntroductions').mockClear();
    });

    it('should successfully create a group introduction', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      jest.spyOn(service, 'canGiveGroupIntroductions').mockResolvedValue(true);
      resourceIntroductionRepository.findOne.mockResolvedValue(null);
      resourceIntroductionRepository.create.mockImplementation((dto) =>
        createMock<ResourceIntroduction>(dto)
      );
      resourceIntroductionRepository.save.mockResolvedValue(mockIntroduction);

      const result = await service.createIntroduction(
        mockGroupId,
        mockIntroducerUserId,
        mockReceiverUserId
      );

      expect(groupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
      expect(service.canGiveGroupIntroductions).toHaveBeenCalledWith(
        mockGroupId,
        mockIntroducerUserId
      );
      expect(resourceIntroductionRepository.findOne).toHaveBeenCalledWith({
        where: {
          resourceGroupId: mockGroupId,
          receiverUserId: mockReceiverUserId,
        },
      });
      expect(resourceIntroductionRepository.create).toHaveBeenCalledWith({
        resourceGroupId: mockGroupId,
        resourceId: null,
        tutorUserId: mockIntroducerUserId,
        receiverUserId: mockReceiverUserId,
      });
      expect(resourceIntroductionRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockIntroduction);
    });

    it('should throw GroupNotFoundException if group does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(null);

      await expect(
        service.createIntroduction(
          mockGroupId,
          mockIntroducerUserId,
          mockReceiverUserId
        )
      ).rejects.toThrow(GroupNotFoundException);
      expect(service.canGiveGroupIntroductions).not.toHaveBeenCalled();
    });

    it('should throw MissingIntroductionPermissionException if tutor lacks permission', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      jest.spyOn(service, 'canGiveGroupIntroductions').mockResolvedValue(false);

      await expect(
        service.createIntroduction(
          mockGroupId,
          mockIntroducerUserId,
          mockReceiverUserId
        )
      ).rejects.toThrow(ForbiddenException);
      expect(resourceIntroductionRepository.findOne).not.toHaveBeenCalled();
      expect(resourceIntroductionRepository.save).not.toHaveBeenCalled();
    });

    it('should throw IntroductionAlreadyCompletedException if introduction already exists', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      jest.spyOn(service, 'canGiveGroupIntroductions').mockResolvedValue(true);
      resourceIntroductionRepository.findOne.mockResolvedValue(
        mockIntroduction
      );

      await expect(
        service.createIntroduction(
          mockGroupId,
          mockIntroducerUserId,
          mockReceiverUserId
        )
      ).rejects.toThrow(BadRequestException);
      expect(resourceIntroductionRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getGroupIntroductions', () => {
    let mockIntroduction: ResourceIntroduction;

    beforeEach(() => {
      mockIntroduction = createMock<ResourceIntroduction>({
        id: 100,
        resourceGroupId: mockGroupId,
        receiverUserId: mockReceiverUserId,
        completedAt: new Date(),
      });
    });

    it('should return paginated introductions for a group', async () => {
      const page = 1;
      const limit = 5;
      const total = 1;
      const mockData = [mockIntroduction];
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionRepository.findAndCount.mockResolvedValue([
        mockData,
        total,
      ]);

      const result = await service.getGroupIntroductions(
        mockGroupId,
        page,
        limit
      );

      expect(groupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
      expect(resourceIntroductionRepository.findAndCount).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId },
        relations: ['receiverUser', 'tutorUser', 'resourceGroup'],
        skip: (page - 1) * limit,
        take: limit,
        order: { completedAt: 'DESC' },
      });
      expect(result).toEqual({ data: mockData, total });
    });

    it('should apply pagination correctly', async () => {
      const page = 3;
      const limit = 7;
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.getGroupIntroductions(mockGroupId, page, limit);

      expect(resourceIntroductionRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: (page - 1) * limit,
          take: limit,
        })
      );
    });

    it('should throw GroupNotFoundException if group does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(null);

      await expect(service.getGroupIntroductions(mockGroupId)).rejects.toThrow(
        GroupNotFoundException
      );
      expect(
        resourceIntroductionRepository.findAndCount
      ).not.toHaveBeenCalled();
    });

    it('should return empty data and total 0 if no introductions exist', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.getGroupIntroductions(mockGroupId);

      expect(result).toEqual({ data: [], total: 0 });
    });
  });

  describe('revokeIntroduction / unrevokeIntroduction', () => {
    let mockIntroduction: ResourceIntroduction;
    const mockIntroductionId = 100;
    const mockHistoryItem = createMock<ResourceIntroductionHistoryItem>();

    beforeEach(() => {
      mockIntroduction = createMock<ResourceIntroduction>({
        id: mockIntroductionId,
        resourceGroupId: mockGroupId,
      });

      resourceIntroductionRepository.findOne.mockResolvedValue(
        mockIntroduction
      );
      jest
        .spyOn(service, 'canManageGroupIntroductions')
        .mockResolvedValue(true);

      resourceIntroductionHistoryRepository.create.mockImplementation((dto) =>
        createMock<ResourceIntroductionHistoryItem>(dto)
      );
      resourceIntroductionHistoryRepository.save.mockResolvedValue(
        mockHistoryItem
      );
    });

    describe('revokeIntroduction', () => {
      it('should successfully revoke an introduction and save history', async () => {
        const comment = 'Revoked for testing';
        const result = await service.revokeIntroduction(
          mockIntroductionId,
          mockAdminUser.id,
          comment
        );

        expect(resourceIntroductionRepository.findOne).toHaveBeenCalledWith({
          where: { id: mockIntroductionId },
          relations: ['resourceGroup'],
        });
        expect(service.canManageGroupIntroductions).toHaveBeenCalledWith(
          mockGroupId,
          mockAdminUser.id
        );

        expect(
          resourceIntroductionHistoryRepository.create
        ).toHaveBeenCalledWith({
          introductionId: mockIntroductionId,
          action: IntroductionHistoryAction.REVOKE,
          performedByUserId: mockAdminUser.id,
          comment,
          createdAt: expect.any(Date),
        });
        expect(resourceIntroductionHistoryRepository.save).toHaveBeenCalled();
        expect(result).toEqual(mockHistoryItem);
      });

      it('should throw ResourceIntroductionNotFoundException if intro not found', async () => {
        resourceIntroductionRepository.findOne.mockResolvedValue(null);

        await expect(
          service.revokeIntroduction(mockIntroductionId, mockAdminUser.id)
        ).rejects.toThrow(ResourceIntroductionNotFoundException);
      });

      it('should throw BadRequestException if intro is not linked to a group', async () => {
        const nonGroupIntro = createMock<ResourceIntroduction>({
          id: mockIntroductionId,
          resourceGroupId: null,
        });
        resourceIntroductionRepository.findOne.mockResolvedValue(nonGroupIntro);

        await expect(
          service.revokeIntroduction(mockIntroductionId, mockAdminUser.id)
        ).rejects.toThrow(BadRequestException);
        await expect(
          service.revokeIntroduction(mockIntroductionId, mockAdminUser.id)
        ).rejects.toThrow(
          `Introduction ID ${mockIntroductionId} does not belong to a group.`
        );
      });

      it('should throw ForbiddenException if user lacks permission', async () => {
        jest
          .spyOn(service, 'canManageGroupIntroductions')
          .mockResolvedValue(false);

        await expect(
          service.revokeIntroduction(mockIntroductionId, mockAdminUser.id)
        ).rejects.toThrow(ForbiddenException);
      });
    });

    describe('unrevokeIntroduction', () => {
      it('should successfully unrevoke an introduction and save history', async () => {
        const comment = 'Un-revoked for testing';
        const result = await service.unrevokeIntroduction(
          mockIntroductionId,
          mockAdminUser.id,
          comment
        );

        expect(resourceIntroductionRepository.findOne).toHaveBeenCalledWith({
          where: { id: mockIntroductionId },
          relations: ['resourceGroup'],
        });
        expect(service.canManageGroupIntroductions).toHaveBeenCalledWith(
          mockGroupId,
          mockAdminUser.id
        );

        expect(
          resourceIntroductionHistoryRepository.create
        ).toHaveBeenCalledWith({
          introductionId: mockIntroductionId,
          action: IntroductionHistoryAction.UNREVOKE,
          performedByUserId: mockAdminUser.id,
          comment,
          createdAt: expect.any(Date),
        });
        expect(resourceIntroductionHistoryRepository.save).toHaveBeenCalled();
        expect(result).toEqual(mockHistoryItem);
      });

      it('should throw ResourceIntroductionNotFoundException if intro not found', async () => {
        resourceIntroductionRepository.findOne.mockResolvedValue(null);
        await expect(
          service.unrevokeIntroduction(mockIntroductionId, mockAdminUser.id)
        ).rejects.toThrow(ResourceIntroductionNotFoundException);
      });

      it('should throw ForbiddenException if user lacks permission', async () => {
        jest
          .spyOn(service, 'canManageGroupIntroductions')
          .mockResolvedValue(false);
        await expect(
          service.unrevokeIntroduction(mockIntroductionId, mockAdminUser.id)
        ).rejects.toThrow(ForbiddenException);
      });
    });
  });

  describe('hasValidGroupIntroduction', () => {
    let mockIntroduction: ResourceIntroduction;

    beforeEach(() => {
      mockIntroduction = createMock<ResourceIntroduction>({
        id: 100,
        resourceGroupId: mockGroupId,
        receiverUserId: mockReceiverUserId,
        completedAt: new Date(),
      });
      jest.spyOn(service, 'isIntroductionRevoked').mockClear();
    });

    it('should return true if introduction exists, is completed, and not revoked', async () => {
      resourceIntroductionRepository.findOne.mockResolvedValue(
        mockIntroduction
      );
      jest.spyOn(service, 'isIntroductionRevoked').mockResolvedValue(false);

      const result = await service.hasValidGroupIntroduction(
        mockGroupId,
        mockReceiverUserId
      );

      expect(resourceIntroductionRepository.findOne).toHaveBeenCalledWith({
        where: {
          resourceGroupId: mockGroupId,
          receiverUserId: mockReceiverUserId,
        },
      });
      expect(service.isIntroductionRevoked).toHaveBeenCalledWith(
        mockIntroduction.id
      );
      expect(result).toBe(true);
    });

    it('should return false if introduction does not exist', async () => {
      resourceIntroductionRepository.findOne.mockResolvedValue(null);

      const result = await service.hasValidGroupIntroduction(
        mockGroupId,
        mockReceiverUserId
      );

      expect(result).toBe(false);
      expect(service.isIntroductionRevoked).not.toHaveBeenCalled();
    });

    it('should return false if introduction is not completed (completedAt is null)', async () => {
      const notCompletedIntro = { ...mockIntroduction, completedAt: null };
      resourceIntroductionRepository.findOne.mockResolvedValue(
        notCompletedIntro
      );

      const result = await service.hasValidGroupIntroduction(
        mockGroupId,
        mockReceiverUserId
      );

      expect(result).toBe(false);
      expect(service.isIntroductionRevoked).not.toHaveBeenCalled();
    });

    it('should return false if introduction is revoked', async () => {
      resourceIntroductionRepository.findOne.mockResolvedValue(
        mockIntroduction
      );
      jest.spyOn(service, 'isIntroductionRevoked').mockResolvedValue(true);

      const result = await service.hasValidGroupIntroduction(
        mockGroupId,
        mockReceiverUserId
      );

      expect(service.isIntroductionRevoked).toHaveBeenCalledWith(
        mockIntroduction.id
      );
      expect(result).toBe(false);
    });
  });

  describe('getGroupIntroductionById', () => {
    let mockIntroduction: ResourceIntroduction;
    const mockIntroductionId = 100;

    beforeEach(() => {
      mockIntroduction = createMock<ResourceIntroduction>({
        id: mockIntroductionId,
        resourceGroupId: mockGroupId,
        receiverUserId: mockReceiverUserId,
      });
    });

    it('should return the introduction if found and belongs to the group', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionRepository.findOne.mockResolvedValue(
        mockIntroduction
      );

      const result = await service.getGroupIntroductionById(
        mockGroupId,
        mockIntroductionId
      );

      expect(groupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
      expect(resourceIntroductionRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockIntroductionId, resourceGroupId: mockGroupId },
        relations: expect.arrayContaining([
          'receiverUser',
          'tutorUser',
          'history',
          'resourceGroup',
        ]),
      });
      expect(result).toEqual(mockIntroduction);
    });

    it('should throw GroupNotFoundException if the group does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(null);

      await expect(
        service.getGroupIntroductionById(mockGroupId, mockIntroductionId)
      ).rejects.toThrow(GroupNotFoundException);
      expect(resourceIntroductionRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw ResourceIntroductionNotFoundException if the introduction does not exist', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getGroupIntroductionById(mockGroupId, mockIntroductionId)
      ).rejects.toThrow(ResourceIntroductionNotFoundException);
    });

    it('should throw ResourceIntroductionNotFoundException if the introduction belongs to a different group', async () => {
      groupsService.getGroupById.mockResolvedValue(mockGroup);
      resourceIntroductionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getGroupIntroductionById(mockGroupId, mockIntroductionId)
      ).rejects.toThrow(ResourceIntroductionNotFoundException);
      expect(resourceIntroductionRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockIntroductionId, resourceGroupId: mockGroupId },
        relations: expect.any(Array),
      });
    });
  });

  describe('canManageGroupIntroducers', () => {
    it('should return true if user has given introductions for the group', async () => {
      resourceIntroductionRepository.count.mockResolvedValue(1);
      usersService.findOne.mockResolvedValue(mockRegularUser);

      const result = await service.canManageGroupIntroducers(
        mockGroupId,
        mockUserId
      );

      expect(resourceIntroductionRepository.count).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId, tutorUserId: mockUserId },
      });
      expect(usersService.findOne).toHaveBeenCalledWith({ id: mockUserId });
      expect(result).toBe(true);
    });

    it('should return true if user has system canManageResources permission', async () => {
      resourceIntroductionRepository.count.mockResolvedValue(0);
      usersService.findOne.mockResolvedValue(mockAdminUser);

      const result = await service.canManageGroupIntroducers(
        mockGroupId,
        mockUserId
      );

      expect(resourceIntroductionRepository.count).toHaveBeenCalledWith({
        where: { resourceGroupId: mockGroupId, tutorUserId: mockUserId },
      });
      expect(usersService.findOne).toHaveBeenCalledWith({ id: mockUserId });
      expect(result).toBe(true);
    });

    it('should return true if user has both given introductions and system permission', async () => {
      resourceIntroductionRepository.count.mockResolvedValue(1);
      usersService.findOne.mockResolvedValue(mockAdminUser);

      const result = await service.canManageGroupIntroducers(
        mockGroupId,
        mockUserId
      );
      expect(result).toBe(true);
    });

    it('should return false if user has neither given introductions nor system permission', async () => {
      resourceIntroductionRepository.count.mockResolvedValue(0);
      usersService.findOne.mockResolvedValue(mockRegularUser);

      const result = await service.canManageGroupIntroducers(
        mockGroupId,
        mockUserId
      );
      expect(result).toBe(false);
    });

    it('should return false if usersService.findOne fails or user not found', async () => {
      resourceIntroductionRepository.count.mockResolvedValue(0);
      usersService.findOne.mockRejectedValue(new Error('User lookup failed'));

      await expect(
        service.canManageGroupIntroducers(mockGroupId, mockUserId)
      ).rejects.toThrow('User lookup failed');
    });
  });

  describe('getIntroductionHistory', () => {
    const mockIntroductionId = 100;
    const mockHistoryItems = [
      createMock<ResourceIntroductionHistoryItem>({
        id: 1,
        action: IntroductionHistoryAction.REVOKE,
      }),
      createMock<ResourceIntroductionHistoryItem>({
        id: 2,
        action: IntroductionHistoryAction.UNREVOKE,
      }),
    ];

    it('should return the history for an introduction', async () => {
      resourceIntroductionHistoryRepository.find.mockResolvedValue(
        mockHistoryItems
      );

      const result = await service.getIntroductionHistory(mockIntroductionId);

      expect(resourceIntroductionHistoryRepository.find).toHaveBeenCalledWith({
        where: { introductionId: mockIntroductionId },
        relations: ['performedByUser'],
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual(mockHistoryItems);
    });

    it('should return an empty array if no history exists', async () => {
      resourceIntroductionHistoryRepository.find.mockResolvedValue([]);

      const result = await service.getIntroductionHistory(mockIntroductionId);

      expect(result).toEqual([]);
    });
  });

  describe('isIntroductionRevoked', () => {
    const mockIntroductionId = 100;

    it('should return true if the latest history action is REVOKE', async () => {
      const mockRevokeHistory = createMock<ResourceIntroductionHistoryItem>({
        action: IntroductionHistoryAction.REVOKE,
      });
      resourceIntroductionHistoryRepository.findOne.mockResolvedValue(
        mockRevokeHistory
      );

      const result = await service.isIntroductionRevoked(mockIntroductionId);

      expect(
        resourceIntroductionHistoryRepository.findOne
      ).toHaveBeenCalledWith({
        where: { introductionId: mockIntroductionId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toBe(true);
    });

    it('should return false if the latest history action is UNREVOKE', async () => {
      const mockUnrevokeHistory = createMock<ResourceIntroductionHistoryItem>({
        action: IntroductionHistoryAction.UNREVOKE,
      });
      resourceIntroductionHistoryRepository.findOne.mockResolvedValue(
        mockUnrevokeHistory
      );

      const result = await service.isIntroductionRevoked(mockIntroductionId);
      expect(result).toBe(false);
    });

    it('should return false if no history exists for the introduction', async () => {
      resourceIntroductionHistoryRepository.findOne.mockResolvedValue(null);

      const result = await service.isIntroductionRevoked(mockIntroductionId);
      expect(result).toBe(false);
    });
  });
});
