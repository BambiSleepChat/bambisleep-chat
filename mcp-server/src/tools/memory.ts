/**
 * 💎 Memory Tools - Conversation Memory & Personalization
 * MCP tools for storing and retrieving conversation context
 */

import { z } from 'zod';

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: (args: any) => Promise<any>;
}

// In-memory storage (replace with database in production)
const memoryStore = new Map<string, any>();

const StoreMemorySchema = z.object({
  userId: z.string(),
  key: z.string(),
  value: z.any(),
  expiresIn: z.number().optional().describe('TTL in seconds'),
});

const RetrieveMemorySchema = z.object({
  userId: z.string(),
  key: z.string(),
});

/**
 * Store memory for a user
 */
async function executeStoreMemory(args: z.infer<typeof StoreMemorySchema>): Promise<string> {
  const { userId, key, value, expiresIn } = args;
  const memoryKey = `${userId}:${key}`;

  const memory = {
    value,
    createdAt: Date.now(),
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : null,
  };

  memoryStore.set(memoryKey, memory);

  return `Memory stored: ${key}`;
}

/**
 * Retrieve memory for a user
 */
async function executeRetrieveMemory(args: z.infer<typeof RetrieveMemorySchema>): Promise<any> {
  const { userId, key } = args;
  const memoryKey = `${userId}:${key}`;

  const memory = memoryStore.get(memoryKey);

  if (!memory) {
    return null;
  }

  // Check expiration
  if (memory.expiresAt && Date.now() > memory.expiresAt) {
    memoryStore.delete(memoryKey);
    return null;
  }

  return memory.value;
}

export const memoryTools: MCPTool[] = [
  {
    name: 'memory_store',
    description: 'Store a memory or preference for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User identifier',
        },
        key: {
          type: 'string',
          description: 'Memory key (e.g., "favorite_topic", "last_mood")',
        },
        value: {
          description: 'Value to store (any JSON-serializable data)',
        },
        expiresIn: {
          type: 'number',
          description: 'Optional expiration time in seconds',
        },
      },
      required: ['userId', 'key', 'value'],
    },
    execute: executeStoreMemory,
  },
  {
    name: 'memory_retrieve',
    description: 'Retrieve a stored memory or preference for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User identifier',
        },
        key: {
          type: 'string',
          description: 'Memory key to retrieve',
        },
      },
      required: ['userId', 'key'],
    },
    execute: executeRetrieveMemory,
  },
];
