import { Rating } from '@prisma/client';
import { prisma } from '../database/client.js';

export interface CreateRatingData {
  userId: string;
  itemId: string;
  score: number;
}

export interface UpdateRatingData {
  score?: number;
}

export interface ListRatingsParams {
  userId?: string;
  itemId?: string;
  skip?: number;
  take?: number;
}

export class RatingRepository {
  async create(data: CreateRatingData): Promise<Rating> {
    if (data.score < 1 || data.score > 5) {
      throw new Error(`Rating score must be between 1 and 5. Provided: ${data.score}`);
    }

    return prisma.rating.create({
      data,
    });
  }

  async findById(id: string): Promise<Rating | null> {
    return prisma.rating.findUnique({
      where: { id },
    });
  }

  async findByUserAndItem(userId: string, itemId: string): Promise<Rating | null> {
    return prisma.rating.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });
  }

  async list(params?: ListRatingsParams): Promise<Rating[]> {
    return prisma.rating.findMany({
      where: {
        ...(params?.userId ? { userId: params.userId } : {}),
        ...(params?.itemId ? { itemId: params.itemId } : {}),
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateRatingData): Promise<Rating> {
    if (data.score !== undefined && (data.score < 1 || data.score > 5)) {
      throw new Error(`Rating score must be between 1 and 5. Provided: ${data.score}`);
    }

    return prisma.rating.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Rating> {
    return prisma.rating.delete({
      where: { id },
    });
  }

  async getAverageRatingForItem(itemId: string): Promise<number | null> {
    const aggregate = await prisma.rating.aggregate({
      where: { itemId },
      _avg: { score: true },
    });

    return aggregate._avg.score;
  }
}

export const ratingRepository = new RatingRepository();
export default ratingRepository;

