import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@attraccess/database';
import { InjectRepository } from '@nestjs/typeorm';

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
}
