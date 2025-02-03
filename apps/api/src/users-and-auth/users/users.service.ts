import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { makePaginatedResponse, PaginatedResponse } from '../../types/response';
import {
  PaginationOptions,
  PaginationOptionsSchema,
} from '../../types/request';
import { loadEnv } from '@attraccess/env';

interface FindOneOptions {
  id?: number;
  username?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(options: FindOneOptions): Promise<User | null> {
    if (!options.id && !options.username) {
      throw new BadRequestException('No options provided');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: options.id,
        username: options.username,
      },
    });

    // Return null instead of throwing an exception
    return user || null;
  }

  async createOne(username: string): Promise<User> {
    const user = new User();
    user.username = username;
    return this.userRepository.save(user);
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResponse<User>> {
    const paginationOptions = PaginationOptionsSchema.parse(options);
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });

    return makePaginatedResponse(options, users, total);
  }
}
