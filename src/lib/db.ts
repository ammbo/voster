import { gibsonApi } from './gibson-api';

type Entity = {
  id?: number;
  uuid?: string;
  date_created?: string;
  date_updated?: string;
};

type QueryOptions = {
  where?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  offset?: number;
};

class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseConnector {
  private static instance: DatabaseConnector;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = '/v1/-';
  }

  public static getInstance(): DatabaseConnector {
    if (!DatabaseConnector.instance) {
      DatabaseConnector.instance = new DatabaseConnector();
    }
    return DatabaseConnector.instance;
  }

  private buildQueryString(options: QueryOptions): string {
    const params: string[] = [];

    if (options.where) {
      const whereConditions = Object.entries(options.where).map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}.eq.${encodeURIComponent(value)}`;
        }
        return `${key}.eq.${value}`;
      });
      params.push(`where=${whereConditions.join(',')}`);
    }

    if (options.orderBy) {
      params.push(`orderBy=${options.orderBy}`);
    }

    if (options.limit) {
      params.push(`limit=${options.limit}`);
    }

    if (options.offset) {
      params.push(`offset=${options.offset}`);
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  /**
   * Create a new record in the specified table
   */
  async create<T extends Entity>(table: string, data: Partial<T>): Promise<T> {
    try {
      const response = await gibsonApi.post(`${this.baseUrl}/${table}`, data);
      return response.data;
    } catch (error) {
      throw new DatabaseError(`Failed to create record in ${table}`, error);
    }
  }

  /**
   * Retrieve a record by UUID
   */
  async getByUuid<T extends Entity>(table: string, uuid: string): Promise<T> {
    try {
      const response = await gibsonApi.get(`${this.baseUrl}/${table}/${uuid}`);
      return response.data;
    } catch (error) {
      throw new DatabaseError(`Failed to get record from ${table} with UUID ${uuid}`, error);
    }
  }

  /**
   * Query records with optional filtering
   */
  async query<T extends Entity>(table: string, options: QueryOptions = {}): Promise<T[]> {
    try {
      const queryString = this.buildQueryString(options);
      const response = await gibsonApi.get(`${this.baseUrl}/${table}${queryString}`);
      return response.data;
    } catch (error) {
      throw new DatabaseError(`Failed to query records from ${table}`, error);
    }
  }

  /**
   * Update a record by UUID
   */
  async update<T extends Entity>(table: string, uuid: string, data: Partial<T>): Promise<T> {
    try {
      const response = await gibsonApi.patch(`${this.baseUrl}/${table}/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw new DatabaseError(`Failed to update record in ${table} with UUID ${uuid}`, error);
    }
  }

  /**
   * Delete a record by UUID
   */
  async delete(table: string, uuid: string): Promise<void> {
    try {
      await gibsonApi.delete(`${this.baseUrl}/${table}/${uuid}`);
    } catch (error) {
      throw new DatabaseError(`Failed to delete record from ${table} with UUID ${uuid}`, error);
    }
  }

  /**
   * Count records with optional filtering
   */
  async count(table: string, options: QueryOptions = {}): Promise<number> {
    try {
      const queryString = this.buildQueryString(options);
      const response = await gibsonApi.get(`${this.baseUrl}/${table}/count${queryString}`);
      return response.data.count;
    } catch (error) {
      throw new DatabaseError(`Failed to count records in ${table}`, error);
    }
  }

  /**
   * Check if a record exists
   */
  async exists(table: string, uuid: string): Promise<boolean> {
    try {
      await this.getByUuid(table, uuid);
      return true;
    } catch (error) {
      if (error instanceof DatabaseError) {
        return false;
      }
      throw error;
    }
  }
}

// Export a singleton instance
export const db = DatabaseConnector.getInstance(); 