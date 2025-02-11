import { Repository } from 'typeorm';
import { mainDataSource } from '@src/configs/mysqlConfig';
import { User } from '@infrastructure/database/main/entities/User';

export const UserRepository = mainDataSource.getRepository(User);
