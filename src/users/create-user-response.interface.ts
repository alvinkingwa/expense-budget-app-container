import { User } from './user.entity';

export interface CreateUserResponse {
  user: User;
  message: string;
}
