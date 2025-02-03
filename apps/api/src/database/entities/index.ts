export * from './authenticationDetail.entity';
export * from './user.entity';

import { User } from './user.entity';
import { AuthenticationDetail } from './authenticationDetail.entity';

export const entities = [AuthenticationDetail, User];
