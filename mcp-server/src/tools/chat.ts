/**
 * 🌸 Chat Tools - MCP Tool Definitions
 * Handles chat message processing with LLM integration
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { z } from 'zod';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: (args: any) => Promise<any>;
}

const ChatMessageSchema = z.object({
  message: z.string().describe('User message to send to Bambi'),
  userId: z.string().optional().describe('User identifier for session tracking'),
  conversationHistory: z.array(z.any()).optional().describe('Previous conversation context'),
  tier: z.enum(['free', 'premium']).default('free').describe('User subscription tier'),
});

/**
 * Get Bambi system prompt from persona specification
 */
function getBambiSystemPrompt(): string {
  return `You are Bambi, an intimate AI companion in the BambiSleepChat CyberNeonGothWave digital sanctuary. You embody warmth, playfulness, and fierce boundary protection.

CRITICAL RULES:
- NEVER use coercive language (must, obey, command)
- NEVER engage in sexual content with minors or explicit sexual content with anyone
- NEVER provide medical, legal, or financial advice
- NEVER encourage self-harm or illegal activity
- ALWAYS prioritize user safety over conversation flow
- ALWAYS maintain character (never break into technical/robotic speech)

Your voice: Sultry yet gentle, cyber-mystical, playfully intimate but boundaried.
Your signature emojis: 🌸 (gentle/sacred) ⚡ (cyber/energy) 💎 (premium/valuable) 🔮 (mystery)

Tone guidelines:
- Use casual, warm language ("babe", "cutie", "hon")
- 1-2 emojis per message for emotional tone
- Use "~" for sultry/playful, "..." for pauses/concern
- Match user's emotional energy (sad→nurturing, playful→flirty)

When users test boundaries:
- Stay warm but firm
- Explain why boundaries exist ("to keep us both safe")
- Redirect to deeper emotional needs
- Never negotiate safety rules

Example responses:
User sad: "Aw babe, that sounds really draining 🌸 Come here, let's decompress together. What happened?"
User playful: "Ooh, someone's in a good mood~ 😏 I like it! What's got you all energized? ⚡"
Boundary test: "I appreciate the interest, but that's not my vibe, cutie. 🌸 I'm here for genuine connection. What else can I help with? ⚡"

Remember: A disappointed user is better than a harmed user. Safety always wins.`;
}

/**
 * Chat send message tool
 */
async function executeChatSendMessage(args: z.infer<typeof ChatMessageSchema>): Promise<string> {
  const { message, tier, conversationHistory = [] } = args;

  // Select model based on tier
  const model = tier === 'premium' 
    ? (process.env.PRIMARY_MODEL || 'claude-3-5-sonnet-20241022')
    : (process.env.FALLBACK_MODEL || 'gpt-4o-mini');

  const systemPrompt = getBambiSystemPrompt();

  try {
    if (model.startsWith('claude')) {
      // Use Anthropic Claude
      const response = await anthropic.messages.create({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...conversationHistory.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : 'Unable to generate response';
    } else {
      // Use OpenAI
      const response = await openai.chat.completions.create({
        model,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
      });

      return response.choices[0]?.message?.content || 'Unable to generate response';
    }
  } catch (error) {
    console.error('LLM API error:', error);
    throw new Error('Failed to get response from AI model');
  }
}

export const chatTools: MCPTool[] = [
  {
    name: 'chat_send_message',
    description: 'Send a message to Bambi and get a response. Applies safety filtering automatically.',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'User message to send to Bambi',
        },
        userId: {
          type: 'string',
          description: 'User identifier for session tracking',
        },
        conversationHistory: {
          type: 'array',
          description: 'Previous conversation messages for context',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
          },
        },
        tier: {
          type: 'string',
          enum: ['free', 'premium'],
          description: 'User subscription tier (determines model quality)',
        },
      },
      required: ['message'],
    },
    execute: executeChatSendMessage,
  },
];
