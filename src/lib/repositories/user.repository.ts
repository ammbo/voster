import { db } from '../db';
import type { UserProfile, UserPreference, UserAuth } from '@/types';

export class UserRepository {
  private static instance: UserRepository;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  /**
   * Create a new user profile
   */
  async createProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return db.create<UserProfile>('user_profile', data);
  }

  /**
   * Get a user profile by UUID
   */
  async getProfile(uuid: string): Promise<UserProfile> {
    return db.getByUuid<UserProfile>('user_profile', uuid);
  }

  /**
   * Get a user profile by username
   */
  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    const results = await db.query<UserProfile>('user_profile', {
      where: { username }
    });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get a user profile by email
   */
  async getProfileByEmail(email: string): Promise<UserProfile | null> {
    const results = await db.query<UserProfile>('user_profile', {
      where: { email }
    });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update a user profile
   */
  async updateProfile(uuid: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return db.update<UserProfile>('user_profile', uuid, data);
  }

  /**
   * Delete a user profile
   */
  async deleteProfile(uuid: string): Promise<void> {
    return db.delete('user_profile', uuid);
  }

  /**
   * Create user preferences
   */
  async createPreferences(data: Partial<UserPreference>): Promise<UserPreference> {
    return db.create<UserPreference>('user_preference', data);
  }

  /**
   * Get user preferences by user ID
   */
  async getPreferencesByUserId(userId: number): Promise<UserPreference | null> {
    const results = await db.query<UserPreference>('user_preference', {
      where: { user_id: userId }
    });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(uuid: string, data: Partial<UserPreference>): Promise<UserPreference> {
    return db.update<UserPreference>('user_preference', uuid, data);
  }

  /**
   * Create user authentication record
   */
  async createAuth(data: Partial<UserAuth>): Promise<UserAuth> {
    return db.create<UserAuth>('user_auth', data);
  }

  /**
   * Get user authentication record by user ID
   */
  async getAuthByUserId(userId: number): Promise<UserAuth | null> {
    const results = await db.query<UserAuth>('user_auth', {
      where: { user_id: userId }
    });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update user authentication record
   */
  async updateAuth(uuid: string, data: Partial<UserAuth>): Promise<UserAuth> {
    return db.update<UserAuth>('user_auth', uuid, data);
  }
}

// Export a singleton instance
export const userRepository = UserRepository.getInstance(); 