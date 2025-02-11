import { Repository } from 'typeorm';
import { mainDataSource } from '@src/configs/mysqlConfig';
import { User } from '@infrastructure/database/multi-tenant/entities/User';

export const UserRepository = mainDataSource.getRepository(User);
