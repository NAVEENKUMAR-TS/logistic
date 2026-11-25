import { User } from '@prisma/client';
import { prisma } from '../database/client.js';

export interface CreateUserData {
  name: string;
  email: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface ListUsersParams {
  skip?: number;
  take?: number;
}

export class UserRepository {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async list(params?: ListUsersParams): Promise<User[]> {
    return prisma.user.findMany({
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async upsert(data: { id?: string; email: string; name: string }): Promise<User> {
    return prisma.user.upsert({
      where: { email: data.email },
      update: { name: data.name },
      create: {
        ...(data.id ? { id: data.id } : {}),
        email: data.email,
        name: data.name,
      },
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
export default userRepository;

