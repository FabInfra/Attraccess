import { Injectable } from '@nestjs/common';
import { User } from '@attraccess/types';

interface FindOneOptions {
  id?: number;
  username?: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findOne(options: FindOneOptions): Promise<User | null> {
    // TODO: replace with database logic
    const user = this.users.find((user) => {
      if (options.id && user.id !== options.id) {
        return false;
      }

      if (options.username && user.username !== options.username) {
        return false;
      }

      return true;
    });

    // Return null instead of throwing an exception
    return user || null;
  }

  // TODO: add authentication logic
  async createOne(username: string): Promise<User> {
    // TODO: replace with database logic
    const user = {
      id: this.users.length + 1,
      username,
    };
    this.users.push(user);
    return user;
  }
}
