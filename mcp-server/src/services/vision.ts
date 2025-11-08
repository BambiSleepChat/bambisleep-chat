/**
 * Vision Service - Image Analysis & Generation
 * Integrates GPT-4 Vision (analysis) and DALL-E 3 (generation)
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

interface ImageAnalysisOptions {
  maxTokens?: number;
  detail?: 'low' | 'high' | 'auto';
  systemPrompt?: string;
}

interface ImageAnalysisResult {
  description: string;
  tags?: string[];
  safetyAssessment?: {
    safe: boolean;
    concerns?: string[];
  };
  confidence?: number;
}

interface ImageGenerationOptions {
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
}

interface ImageGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
  localPath?: string;
}

/**
 * Vision service combining GPT-4 Vision and DALL-E 3
 */
export class VisionService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    logger.info('👁️ VisionService initialized', {
      gpt4VisionEnabled: !!apiKey,
      dalleEnabled: !!apiKey,
    });
  }

  /**
   * Analyze image using GPT-4 Vision
   * Supports local files or URLs
   */
  async analyzeImage(
    imagePath: string,
    prompt: string,
    options: ImageAnalysisOptions = {}
  ): Promise<ImageAnalysisResult> {
    const startTime = Date.now();

    try {
      logger.info('👁️ Starting GPT-4 Vision analysis', {
        imagePath: path.basename(imagePath),
        promptLength: prompt.length,
        detail: options.detail ?? 'auto',
      });

      // Determine if imagePath is URL or local file
      const isUrl = imagePath.startsWith('http://') || imagePath.startsWith('https://');
      let imageUrl: string;

      if (isUrl) {
        imageUrl = imagePath;
      } else {
        // Validate local file exists
        if (!fs.existsSync(imagePath)) {
          throw new Error(`Image file not found: ${imagePath}`);
        }

        // Read and encode image as base64
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const ext = path.extname(imagePath).toLowerCase();
        const mimeType = this.getMimeType(ext);
        imageUrl = `data:${mimeType};base64,${base64Image}`;
      }

      // Prepare system prompt for safety-aware analysis
      const systemPrompt =
        options.systemPrompt ??
        'You are analyzing images for an AI companion. ' +
          'Provide detailed, helpful descriptions while being safety-conscious. ' +
          'Flag any concerning content (violence, explicit material, etc.).';

      // Call GPT-4 Vision API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: options.detail ?? 'auto',
                },
              },
            ],
          },
        ],
        max_tokens: options.maxTokens ?? 500,
      });

      const description = response.choices[0]?.message?.content ?? '';
      const duration = Date.now() - startTime;

      // Basic safety assessment (check for concerning keywords in response)
      const safetyKeywords = [
        'violent',
        'explicit',
        'inappropriate',
        'disturbing',
        'nsfw',
      ];
      const concerns = safetyKeywords.filter((keyword) =>
        description.toLowerCase().includes(keyword)
      );

      logger.info('✅ GPT-4 Vision analysis complete', {
        descriptionLength: description.length,
        duration: `${duration}ms`,
        safetyConcerns: concerns.length,
      });

      return {
        description,
        safetyAssessment: {
          safe: concerns.length === 0,
          concerns: concerns.length > 0 ? concerns : undefined,
        },
      };
    } catch (error: unknown) {
      logger.error('❌ GPT-4 Vision analysis failed', {
        error: error instanceof Error ? error.message : String(error),
        imagePath: path.basename(imagePath),
      });
      throw error;
    }
  }

  /**
   * Generate image using DALL-E 3
   * Returns image URL and optionally downloads to local path
   */
  async generateImage(
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<ImageGenerationResult> {
    const startTime = Date.now();

    try {
      logger.info('🎨 Starting DALL-E 3 generation', {
        promptLength: prompt.length,
        size: options.size ?? '1024x1024',
        quality: options.quality ?? 'standard',
      });

      // Apply safety filtering to prompt
      const safePrompt = await this.applySafetyFilter(prompt);

      // Call DALL-E 3 API
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: safePrompt,
        size: options.size ?? '1024x1024',
        quality: options.quality ?? 'standard',
        style: options.style ?? 'vivid',
        n: 1, // DALL-E 3 only supports n=1
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No image data returned from DALL-E 3');
      }

      const imageUrl = response.data[0]?.url;
      const revisedPrompt = response.data[0]?.revised_prompt;

      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E 3');
      }

      const duration = Date.now() - startTime;

      logger.info('✅ DALL-E 3 generation complete', {
        imageUrl: imageUrl.substring(0, 50) + '...',
        revisedPrompt: revisedPrompt?.substring(0, 100),
        duration: `${duration}ms`,
      });

      return {
        imageUrl,
        revisedPrompt,
      };
    } catch (error: unknown) {
      logger.error('❌ DALL-E 3 generation failed', {
        error: error instanceof Error ? error.message : String(error),
        promptLength: prompt.length,
      });
      throw error;
    }
  }

  /**
   * Download image from URL to local file
   */
  async downloadImage(imageUrl: string, outputPath: string): Promise<string> {
    try {
      logger.info('📥 Downloading image', {
        url: imageUrl.substring(0, 50) + '...',
        outputPath: path.basename(outputPath),
      });

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, buffer);

      logger.info('✅ Image downloaded', {
        outputPath,
        sizeKB: (buffer.length / 1024).toFixed(2),
      });

      return outputPath;
    } catch (error: unknown) {
      logger.error('❌ Image download failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Apply safety filtering to image generation prompts
   * Blocks explicit/violent content requests
   */
  private async applySafetyFilter(prompt: string): Promise<string> {
    // Check for banned keywords
    const bannedKeywords = [
      'nude',
      'naked',
      'explicit',
      'nsfw',
      'sexual',
      'erotic',
      'porn',
      'violence',
      'gore',
      'blood',
      'death',
      'kill',
      'weapon',
      'gun',
      'knife',
    ];

    const lowerPrompt = prompt.toLowerCase();
    const violations = bannedKeywords.filter((keyword) =>
      lowerPrompt.includes(keyword)
    );

    if (violations.length > 0) {
      logger.warn('⚠️ Image prompt safety violation detected', {
        violations,
        prompt: prompt.substring(0, 100),
      });
      throw new Error(
        `Image prompt contains prohibited content: ${violations.join(', ')}. ` +
          'Please request appropriate imagery only.'
      );
    }

    return prompt;
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
    };

    return mimeTypes[ext] ?? 'image/jpeg';
  }

  /**
   * Validate image file format
   */
  private isValidImageFormat(filePath: string): boolean {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const ext = path.extname(filePath).toLowerCase();
    return validExtensions.includes(ext);
  }
}
