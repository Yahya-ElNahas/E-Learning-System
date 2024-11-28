import { SetMetadata } from '@nestjs/common';
import { Role as UserRole } from '../user/user.schema';

export const ROLES_KEY = 'roles';
export const Role = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
