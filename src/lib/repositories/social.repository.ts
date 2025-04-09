import { db } from '../db';
import type { SocialAccount, SocialPost, SocialMessage } from '@/types';

export class SocialRepository {
  private static instance: SocialRepository;

  private constructor() {}

  public static getInstance(): SocialRepository {
    if (!SocialRepository.instance) {
      SocialRepository.instance = new SocialRepository();
    }
    return SocialRepository.instance;
  }

  /**
   * Create a new social account
   */
  async createAccount(data: Partial<SocialAccount>): Promise<SocialAccount> {
    return db.create<SocialAccount>('social_account', data);
  }

  /**
   * Get a social account by UUID
   */
  async getAccount(uuid: string): Promise<SocialAccount> {
    return db.getByUuid<SocialAccount>('social_account', uuid);
  }

  /**
   * Get all social accounts for a user
   */
  async getUserAccounts(userId: number): Promise<SocialAccount[]> {
    return db.query<SocialAccount>('social_account', {
      where: { user_id: userId }
    });
  }

  /**
   * Update a social account
   */
  async updateAccount(uuid: string, data: Partial<SocialAccount>): Promise<SocialAccount> {
    return db.update<SocialAccount>('social_account', uuid, data);
  }

  /**
   * Delete a social account
   */
  async deleteAccount(uuid: string): Promise<void> {
    return db.delete('social_account', uuid);
  }

  /**
   * Create a new social post
   */
  async createPost(data: Partial<SocialPost>): Promise<SocialPost> {
    return db.create<SocialPost>('social_post', data);
  }

  /**
   * Get a social post by UUID
   */
  async getPost(uuid: string): Promise<SocialPost> {
    return db.getByUuid<SocialPost>('social_post', uuid);
  }

  /**
   * Get all social posts for a video
   */
  async getVideoPosts(videoId: number): Promise<SocialPost[]> {
    return db.query<SocialPost>('social_post', {
      where: { video_id: videoId }
    });
  }

  /**
   * Update a social post
   */
  async updatePost(uuid: string, data: Partial<SocialPost>): Promise<SocialPost> {
    return db.update<SocialPost>('social_post', uuid, data);
  }

  /**
   * Delete a social post
   */
  async deletePost(uuid: string): Promise<void> {
    return db.delete('social_post', uuid);
  }

  /**
   * Create a new social message
   */
  async createMessage(data: Partial<SocialMessage>): Promise<SocialMessage> {
    return db.create<SocialMessage>('social_message', data);
  }

  /**
   * Get a social message by UUID
   */
  async getMessage(uuid: string): Promise<SocialMessage> {
    return db.getByUuid<SocialMessage>('social_message', uuid);
  }

  /**
   * Get all messages for a post
   */
  async getPostMessages(postId: number): Promise<SocialMessage[]> {
    return db.query<SocialMessage>('social_message', {
      where: { post_id: postId }
    });
  }

  /**
   * Update a social message
   */
  async updateMessage(uuid: string, data: Partial<SocialMessage>): Promise<SocialMessage> {
    return db.update<SocialMessage>('social_message', uuid, data);
  }

  /**
   * Delete a social message
   */
  async deleteMessage(uuid: string): Promise<void> {
    return db.delete('social_message', uuid);
  }
}

// Export a singleton instance
export const socialRepository = SocialRepository.getInstance(); 