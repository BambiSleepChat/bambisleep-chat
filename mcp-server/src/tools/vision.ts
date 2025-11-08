/**
 * Vision Tools - MCP tools for image analysis and generation
 */

import { VisionService } from '../services/vision.js';
import { logger } from '../utils/logger.js';
import path from 'path';

// Initialize vision service
const openaiApiKey = process.env.OPENAI_API_KEY ?? '';

let visionService: VisionService | null = null;

if (openaiApiKey) {
  visionService = new VisionService(openaiApiKey);
  logger.info('👁️ Vision tools initialized');
} else {
  logger.warn('⚠️ Vision tools disabled - missing OPENAI_API_KEY');
}

/**
 * MCP Tool: Analyze image using GPT-4 Vision
 */
export const analyzeImageTool = {
  name: 'vision_analyze_image',
  description:
    'Analyze an image using GPT-4 Vision to extract descriptions, identify objects, ' +
    'read text, or answer questions about the image content. ' +
    'Supports local files (jpg, png, gif, webp) or URLs. ' +
    'Includes automatic safety assessment for concerning content.',
  inputSchema: {
    type: 'object',
    properties: {
      imagePath: {
        type: 'string',
        description:
          'Absolute path to local image file OR URL to online image. ' +
          'Supported formats: jpg, jpeg, png, gif, webp, bmp.',
      },
      prompt: {
        type: 'string',
        description:
          'Question or instruction for image analysis. ' +
          'Examples: "Describe this image", "What objects are visible?", "Read any text in this image".',
      },
      detail: {
        type: 'string',
        enum: ['low', 'high', 'auto'],
        description:
          'Image detail level. "high" = more detailed analysis (slower, more tokens). ' +
          '"low" = faster, less detailed. "auto" = automatic (default).',
      },
    },
    required: ['imagePath', 'prompt'],
  },
  async execute(args: {
    imagePath: string;
    prompt: string;
    detail?: 'low' | 'high' | 'auto';
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    if (!visionService) {
      return {
        content: [
          {
            type: 'text',
            text: '❌ Vision service not initialized. Please set OPENAI_API_KEY environment variable.',
          },
        ],
      };
    }

    try {
      logger.info('👁️ Image analysis requested', {
        imagePath: path.basename(args.imagePath),
        prompt: args.prompt.substring(0, 100),
      });

      const result = await visionService.analyzeImage(
        args.imagePath,
        args.prompt,
        {
          detail: args.detail,
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                description: result.description,
                safetyAssessment: result.safetyAssessment,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: unknown) {
      logger.error('❌ Image analysis failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: false,
                error:
                  error instanceof Error ? error.message : 'Unknown error',
              },
              null,
              2
            ),
          },
        ],
      };
    }
  },
};

/**
 * MCP Tool: Generate image using DALL-E 3
 */
export const generateImageTool = {
  name: 'vision_generate_image',
  description:
    'Generate a new image from a text description using DALL-E 3. ' +
    'Creates high-quality, photorealistic or artistic images. ' +
    'Includes automatic safety filtering to block inappropriate content. ' +
    'Returns image URL (valid for 1 hour) and optionally saves to local file.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description:
          'Detailed description of the image to generate. ' +
          'Be specific about style, mood, composition, colors, etc. ' +
          'Example: "A friendly anime catgirl with pink hair in cyberpunk neon city at night".',
      },
      size: {
        type: 'string',
        enum: ['1024x1024', '1792x1024', '1024x1792'],
        description:
          'Image dimensions. "1024x1024" = square, "1792x1024" = landscape, "1024x1792" = portrait. Default: 1024x1024.',
      },
      quality: {
        type: 'string',
        enum: ['standard', 'hd'],
        description:
          'Image quality. "standard" = faster, cheaper. "hd" = higher detail, more expensive. Default: standard.',
      },
      style: {
        type: 'string',
        enum: ['vivid', 'natural'],
        description:
          'Image style. "vivid" = hyper-real, dramatic. "natural" = more realistic, less hyper-real. Default: vivid.',
      },
      saveToPath: {
        type: 'string',
        description:
          'Optional: absolute path to save generated image locally (must end in .png). ' +
          'If omitted, only URL is returned (valid 1 hour).',
      },
    },
    required: ['prompt'],
  },
  async execute(args: {
    prompt: string;
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
    saveToPath?: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    if (!visionService) {
      return {
        content: [
          {
            type: 'text',
            text: '❌ Vision service not initialized. Please set OPENAI_API_KEY environment variable.',
          },
        ],
      };
    }

    try {
      logger.info('🎨 Image generation requested', {
        promptLength: args.prompt.length,
        size: args.size,
        quality: args.quality,
      });

      const result = await visionService.generateImage(args.prompt, {
        size: args.size,
        quality: args.quality,
        style: args.style,
      });

      // Optionally download to local path
      let localPath: string | undefined;
      if (args.saveToPath) {
        localPath = await visionService.downloadImage(
          result.imageUrl,
          args.saveToPath
        );
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                imageUrl: result.imageUrl,
                localPath,
                revisedPrompt: result.revisedPrompt,
                note: 'Image URL valid for 1 hour. Download if needed.',
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: unknown) {
      logger.error('❌ Image generation failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: false,
                error:
                  error instanceof Error ? error.message : 'Unknown error',
              },
              null,
              2
            ),
          },
        ],
      };
    }
  },
};

// Export all vision tools
export const visionTools = [analyzeImageTool, generateImageTool];
