import { User, IUser } from './user.model';

export class UserService {
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }
}

export const userService = new UserService();
