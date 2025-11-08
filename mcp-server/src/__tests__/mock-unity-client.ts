/**
 * Mock Unity Client for Testing
 * Simulates Unity avatar WebSocket communication
 */

import WebSocket from 'ws';
import { logger } from '../utils/logger.js';

export interface UnityMessage {
  type: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface EmotionData {
  emotion: string;
  intensity: number;
}

export interface AnimationData {
  animation: string;
  duration?: number;
  loop?: boolean;
}

export interface ChatData {
  userId: string;
  message: string;
}

/**
 * Mock Unity client for testing WebSocket integration
 */
export class MockUnityClient {
  private ws: WebSocket | null = null;
  private readonly serverUrl: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandlers: Map<string, (data: UnityMessage) => void> = new Map();

  constructor(serverUrl = 'ws://localhost:3001') {
    this.serverUrl = serverUrl;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      logger.info('🎮 Mock Unity client connecting', { url: this.serverUrl });

      this.ws = new WebSocket(this.serverUrl);

      this.ws.on('open', () => {
        logger.info('✅ Mock Unity client connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        resolve();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        this.handleMessage(data.toString());
      });

      this.ws.on('close', () => {
        logger.warn('⚠️ Mock Unity client disconnected');
        this.stopHeartbeat();
        this.attemptReconnect();
      });

      this.ws.on('error', (error) => {
        logger.error('❌ Mock Unity client error', {
          error: error.message,
        });
        reject(error);
      });
    });
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    logger.info('🎮 Mock Unity client disconnected');
  }

  /**
   * Send emotion state update
   */
  async sendEmotion(emotion: string, intensity: number): Promise<void> {
    await this.send({
      type: 'emotion_state',
      timestamp: new Date().toISOString(),
      data: { emotion, intensity },
    });
  }

  /**
   * Send animation trigger
   */
  async sendAnimation(
    animation: string,
    duration?: number,
    loop?: boolean
  ): Promise<void> {
    await this.send({
      type: 'animation_trigger',
      timestamp: new Date().toISOString(),
      data: { animation, duration, loop },
    });
  }

  /**
   * Send chat message from Unity
   */
  async sendChat(userId: string, message: string): Promise<void> {
    await this.send({
      type: 'chat_message',
      timestamp: new Date().toISOString(),
      data: { userId, message },
    });
  }

  /**
   * Send heartbeat
   */
  async sendHeartbeat(): Promise<void> {
    await this.send({
      type: 'heartbeat',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Register message handler for specific type
   */
  on(messageType: string, handler: (data: UnityMessage) => void): void {
    this.messageHandlers.set(messageType, handler);
  }

  /**
   * Wait for specific message type
   */
  async waitForMessage(messageType: string, timeoutMs = 5000): Promise<UnityMessage> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout waiting for message type: ${messageType}`));
      }, timeoutMs);

      this.on(messageType, (msg) => {
        clearTimeout(timeout);
        resolve(msg);
      });
    });
  }

  /**
   * Send generic message
   */
  private async send(message: UnityMessage): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    this.ws.send(JSON.stringify(message));
    logger.debug('🎮 Mock Unity sent message', {
      type: message.type,
      data: message.data,
    });
  }

  /**
   * Handle incoming message
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data) as UnityMessage;
      logger.debug('🎮 Mock Unity received message', {
        type: message.type,
        data: message.data,
      });

      // Call registered handler
      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message);
      }

      // Call wildcard handler
      const wildcardHandler = this.messageHandlers.get('*');
      if (wildcardHandler) {
        wildcardHandler(message);
      }
    } catch (error) {
      logger.error('❌ Failed to parse Unity message', {
        error: error instanceof Error ? error.message : String(error),
        data,
      });
    }
  }

  /**
   * Start heartbeat interval
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat().catch((error) => {
        logger.error('❌ Heartbeat failed', {
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }, 5000); // Every 5 seconds
  }

  /**
   * Stop heartbeat interval
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('❌ Max reconnect attempts reached', {
        attempts: this.reconnectAttempts,
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    logger.info('🔄 Attempting reconnect', {
      attempt: this.reconnectAttempts,
      delayMs: delay,
    });

    setTimeout(() => {
      this.connect().catch((error) => {
        logger.error('❌ Reconnect failed', {
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }, delay);
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
