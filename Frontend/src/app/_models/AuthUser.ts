import { User } from './User';

export interface AuthUser {
    token: string;
    user: User;
}