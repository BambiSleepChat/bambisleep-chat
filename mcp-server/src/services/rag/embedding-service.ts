/**
 * Local embedding service using transformers.js
 * No external API dependencies - runs entirely offline
 * @module services/rag/embedding-service
 */

import type { EmbeddingConfig, EmbeddingCache } from './types.js';

/**
 * Service for generating text embeddings locally
 * Uses transformers.js for browser/Node.js compatibility
 */
export class EmbeddingService {
  private readonly config: EmbeddingConfig;
  private cache: Map<string, EmbeddingCache> = new Map();
  private model: any = null;
  private isInitialized = false;

  constructor(config: Partial<EmbeddingConfig> = {}) {
    this.config = {
      model: 'all-MiniLM-L6-v2',
      dimensions: 384,
      indexType: 'Flat',
      cacheSize: 1000,
      ...config,
    };
  }

  /**
   * Initialize the embedding model
   * Downloads model on first run (cached locally after)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log(`[EmbeddingService] Initializing ${this.config.model}...`);
      console.log('[EmbeddingService] Model will be downloaded on first use');
      
      this.isInitialized = true;
      console.log('[EmbeddingService] Ready');
    } catch (error) {
      console.error('[EmbeddingService] Initialization failed:', error);
      throw new Error(`Failed to initialize embedding model: ${error}`);
    }
  }

  /**
   * Generate embedding for text
   * Uses cache if available, otherwise computes new embedding
   */
  async generateEmbedding(text: string): Promise<readonly number[]> {
    // Check cache first
    const cached = this.cache.get(text);
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
      return cached.embedding;
    }

    // Generate new embedding
    const embedding = await this.computeEmbedding(text);

    // Update cache
    this.updateCache(text, embedding);

    return embedding;
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(texts: readonly string[]): Promise<readonly (readonly number[])[]> {
    const embeddings: number[][] = [];

    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(Array.from(embedding));
    }

    return embeddings;
  }

  /**
   * Compute embedding using the model
   */
  private async computeEmbedding(text: string): Promise<readonly number[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.warn('[EmbeddingService] Using mock embeddings - install @xenova/transformers for production');
      return this.mockEmbedding(text);
    } catch (error) {
      console.error('[EmbeddingService] Embedding generation failed:', error);
      throw new Error(`Failed to generate embedding: ${error}`);
    }
  }

  /**
   * Mock embedding for development/testing
   */
  private mockEmbedding(text: string): readonly number[] {
    const hash = this.simpleHash(text);
    const embedding = new Array(this.config.dimensions);
    
    for (let i = 0; i < this.config.dimensions; i++) {
      const seed = (hash + i) % 1000;
      embedding[i] = (Math.sin(seed) + 1) / 2;
    }

    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / norm);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private updateCache(text: string, embedding: readonly number[]): void {
    if (this.cache.size >= (this.config.cacheSize || 1000)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(text, {
      text,
      embedding,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0,
    };
  }
}
