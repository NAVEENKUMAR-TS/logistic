import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/user.repository.js';

export interface ProvisionResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
    emailConfirmed: boolean;
  };
  prismaSynced?: boolean;
  error?: string;
}

export class AdminAuthService {
  private getAdminClient(overrideKey?: string): SupabaseClient | null {
    const key = overrideKey || config.supabaseServiceRoleKey;
    if (!key) return null;
    return createClient(config.supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async provisionTestAccount(
    email = 'admin.ailms@gmail.com',
    password = '12345678',
    overrideKey?: string
  ): Promise<ProvisionResult> {
    if (config.nodeEnv === 'production') {
      return {
        success: false,
        message: 'Security Block: Provisioning test accounts is forbidden in production environments.',
        error: 'Forbidden in production',
      };
    }

    const adminClient = this.getAdminClient(overrideKey);
    if (!adminClient) {
      return {
        success: false,
        message:
          'SUPABASE_SERVICE_ROLE_KEY is required to invoke the Supabase Admin API. Please add SUPABASE_SERVICE_ROLE_KEY to your .env file.',
        error: 'Missing service role key',
      };
    }

    try {
      // 1. Check if user already exists in Supabase Auth
      const {
        data: { users },
        error: listError,
      } = await adminClient.auth.admin.listUsers();

      if (listError) {
        return {
          success: false,
          message: `Supabase Admin API list error: ${listError.message}`,
          error: listError.message,
        };
      }

      const existingUser = users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      let targetUser: SupabaseUser;

      if (existingUser) {
        // Update existing test account: reset password, confirm email, set role
        const { data: updateData, error: updateError } =
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
            user_metadata: {
              name: 'Development Test User',
              role: 'admin',
            },
          });

        if (updateError || !updateData.user) {
          return {
            success: false,
            message: `Failed to update existing user: ${updateError?.message}`,
            error: updateError?.message,
          };
        }
        targetUser = updateData.user;
      } else {
        // Create fresh test user with email_confirm: true and admin role
        const { data: createData, error: createError } =
          await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
              name: 'Development Test User',
              role: 'admin',
            },
          });

        if (createError || !createData.user) {
          return {
            success: false,
            message: `Failed to create test user: ${createError?.message}`,
            error: createError?.message,
          };
        }
        targetUser = createData.user;
      }

      // 2. Synchronize profile in Prisma database
      let prismaSynced = false;
      try {
        await userRepository.upsert({
          id: targetUser.id,
          email: targetUser.email || email,
          name: 'Development Test User',
        });
        prismaSynced = true;
      } catch (dbErr) {
        console.warn(
          '[AdminAuthService] Prisma profile sync skipped or failed (check DB connection):',
          dbErr instanceof Error ? dbErr.message : dbErr
        );
        prismaSynced = false;
      }

      return {
        success: true,
        message: `Successfully provisioned development testing account: ${email}`,
        user: {
          id: targetUser.id,
          email: targetUser.email || email,
          role: 'admin',
          emailConfirmed: Boolean(targetUser.email_confirmed_at),
        },
        prismaSynced,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown exception in AdminAuthService';
      return {
        success: false,
        message: `Provisioning exception: ${message}`,
        error: message,
      };
    }
  }
}

export const adminAuthService = new AdminAuthService();
export default adminAuthService;

