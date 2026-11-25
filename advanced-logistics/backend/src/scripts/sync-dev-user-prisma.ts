import { userRepository } from '../repositories/user.repository.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function syncPrisma() {
  console.log('Attempting Prisma sync for admin.ailms@gmail.com...');
  try {
    const user = await userRepository.upsert({
      id: 'a298ae78-4646-4099-9e95-0ae593f79032',
      email: 'admin.ailms@gmail.com',
      name: 'Dev Tester',
    });
    console.log('SUCCESS: Prisma profile synced:', user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log('Prisma sync notice (database connection):', message);
  }
}

syncPrisma().catch(console.error);

