import { Item } from '@prisma/client';
import { prisma } from '../database/client.js';

export interface CreateItemData {
  title: string;
}

export interface UpdateItemData {
  title?: string;
}

export interface ListItemsParams {
  skip?: number;
  take?: number;
}

export class ItemRepository {
  async create(data: CreateItemData): Promise<Item> {
    return prisma.item.create({
      data,
    });
  }

  async findById(id: string): Promise<Item | null> {
    return prisma.item.findUnique({
      where: { id },
    });
  }

  async list(params?: ListItemsParams): Promise<Item[]> {
    return prisma.item.findMany({
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateItemData): Promise<Item> {
    return prisma.item.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Item> {
    return prisma.item.delete({
      where: { id },
    });
  }
}

export const itemRepository = new ItemRepository();
export default itemRepository;

