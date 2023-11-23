import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { MediaService } from '../../media/services/media.service';
import { User } from '../entities/user.entity';
import { UserError } from '../errors';
import { INewUser, IUpdatedUser } from '../interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}

  public async create(newUser: INewUser): Promise<User> {
    const user = new User();
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;
    user.email = newUser.email;
    user.password = await this.hashPassword(newUser.password);

    if (newUser.avatarImageId) {
      await this.mediaService.getMedia(newUser.avatarImageId).then((media) => {
        if (media) {
          user.avatarUrl = media.url;
        }
      });
    }

    await this.userRepository.insert(user);
    delete user.password;
    return user;
  }

  private async hashPassword(text: string): Promise<string> {
    const SALT_ROUND = 10;
    return hash(text, SALT_ROUND);
  }

  public async getById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id }).then((user) => {
      if (!user) {
        throw new Error(UserError.NOT_FOUND);
      }
      return user;
    });
  }

  public async update(id: number, updatedUser: IUpdatedUser): Promise<User> {
    const { avatarImageId, ...user } = updatedUser;
    let avatar = {};
    if (avatarImageId) {
      await this.mediaService.getMedia(avatarImageId).then((media) => {
        if (media) {
          avatar = { avatarUrl: media.url };
        }
      });
    }

    return this.userRepository
      .update({ id }, { ...user, ...avatar })
      .then((updateResult) => {
        if (updateResult.affected !== 1) {
          throw new Error(UserError.NOT_FOUND);
        }
        return this.userRepository.findOneBy({ id });
      });
  }
}
