/**
 * Multi-Modal Conversation Service
 * Coordinates voice, text, image, and avatar interactions
 */

import { VoiceService } from './voice.js';
import { VisionService } from './vision.js';
import { IntegratedChatService } from '../integrated-chat.js';
import { logger } from '../utils/logger.js';

export interface MultiModalInput {
  text?: string;
  audioPath?: string;
  imagePath?: string;
  userId: string;
  sessionId: string;
}

export interface MultiModalOutput {
  textResponse: string;
  audioPath?: string;
  emotion?: string;
  animation?: string;
  imageAnalysis?: string;
}

export interface ConversationContext {
  mode: 'text' | 'voice' | 'visual' | 'mixed';
  currentEmotion: string;
  lastInputType: 'text' | 'voice' | 'image';
  conversationStyle: string;
}

/**
 * Multi-modal conversation coordinator
 * Handles voice+text+image inputs simultaneously
 */
export class MultiModalService {
  private voiceService: VoiceService | null = null;
  private visionService: VisionService | null = null;
  private chatService: IntegratedChatService;
  private contextMap: Map<string, ConversationContext> = new Map();

  constructor(
    chatService: IntegratedChatService,
    voiceService?: VoiceService,
    visionService?: VisionService
  ) {
    this.chatService = chatService;
    this.voiceService = voiceService ?? null;
    this.visionService = visionService ?? null;

    logger.info('🎭 MultiModalService initialized', {
      voiceEnabled: !!voiceService,
      visionEnabled: !!visionService,
    });
  }

  /**
   * Process multi-modal input and generate appropriate response
   */
  async processInput(input: MultiModalInput): Promise<MultiModalOutput> {
    const startTime = Date.now();

    try {
      logger.info('🎭 Processing multi-modal input', {
        userId: input.userId,
        hasText: !!input.text,
        hasAudio: !!input.audioPath,
        hasImage: !!input.imagePath,
      });

      // 1. Convert audio to text if provided
      let textInput = input.text ?? '';
      if (input.audioPath && this.voiceService) {
        const transcription = await this.voiceService.transcribe(
          input.audioPath
        );
        textInput = transcription.text;
        logger.info('🎤 Transcribed audio input', {
          text: textInput.substring(0, 100),
        });
      }

      // 2. Analyze image if provided
      let imageContext = '';
      if (input.imagePath && this.visionService) {
        const analysis = await this.visionService.analyzeImage(
          input.imagePath,
          'Describe this image in detail. What is the user showing me?'
        );
        imageContext = analysis.description;
        logger.info('👁️ Analyzed image input', {
          analysis: imageContext.substring(0, 100),
        });

        // Add image context to text input
        if (imageContext) {
          textInput += `\n\n[User shared an image: ${imageContext}]`;
        }
      }

      // 3. Get conversational context for this session
      const context = this.getOrCreateContext(input.sessionId);

      // 4. Determine conversation mode
      const mode = this.determineMode(input);
      context.mode = mode;
      context.lastInputType = input.imagePath
        ? 'image'
        : input.audioPath
        ? 'voice'
        : 'text';

      // 5. Generate text response using integrated chat
      const chatResponse = await this.chatService.chat(textInput, {
        userId: input.userId,
        enablePersonalization: true,
        contextWindow: 5,
      });

      // 6. Determine avatar emotion/animation based on response
      const { emotion, animation } = this.selectAvatarResponse(
        chatResponse.content,
        context
      );
      context.currentEmotion = emotion;

      // 7. Generate voice output if voice mode
      let audioPath: string | undefined;
      if (
        (mode === 'voice' || mode === 'mixed') &&
        this.voiceService &&
        chatResponse.content
      ) {
        const outputPath = `/tmp/response_${Date.now()}.mp3`;
        
        // Map emotion to voice stability/style settings
        const emotionMap: Record<string, { stability: number; style?: number }> = {
          neutral: { stability: 0.5, style: 0.0 },
          happy: { stability: 0.3, style: 0.6 },
          sad: { stability: 0.7, style: 0.2 },
          excited: { stability: 0.2, style: 0.8 },
          calm: { stability: 0.8, style: 0.1 },
        };
        
        const voiceSettings = emotionMap[emotion] ?? emotionMap.neutral;
        
        const synthesis = await this.voiceService.synthesize(
          chatResponse.content,
          voiceSettings
        );

        const fs = await import('fs');
        fs.default.writeFileSync(outputPath, synthesis.audio);
        audioPath = outputPath;

        logger.info('🔊 Generated voice response', {
          audioPath,
          sizeKB: (synthesis.audio.length / 1024).toFixed(2),
        });
      }

      const duration = Date.now() - startTime;

      logger.info('✅ Multi-modal processing complete', {
        duration: `${duration}ms`,
        mode,
        emotion,
        hasAudio: !!audioPath,
      });

      return {
        textResponse: chatResponse.content,
        audioPath,
        emotion,
        animation,
        imageAnalysis: imageContext || undefined,
      };
    } catch (error: unknown) {
      logger.error('❌ Multi-modal processing failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Determine conversation mode based on input types
   */
  private determineMode(
    input: MultiModalInput
  ): 'text' | 'voice' | 'visual' | 'mixed' {
    const hasAudio = !!input.audioPath;
    const hasImage = !!input.imagePath;
    const hasText = !!input.text;

    if (hasAudio && hasImage) return 'mixed';
    if (hasImage) return 'visual';
    if (hasAudio) return 'voice';
    if (hasText) return 'text';

    return 'text';
  }

  /**
   * Select appropriate avatar emotion and animation
   */
  private selectAvatarResponse(
    responseText: string,
    _context: ConversationContext
  ): { emotion: string; animation: string } {
    // Analyze response sentiment to determine emotion
    const text = responseText.toLowerCase();

    // Emotion detection patterns
    if (
      text.includes('love') ||
      text.includes('adorable') ||
      text.includes('💖')
    ) {
      return { emotion: 'loving', animation: 'heart_eyes' };
    }

    if (
      text.includes('excited') ||
      text.includes('yay') ||
      text.includes('🎉')
    ) {
      return { emotion: 'excited', animation: 'bounce' };
    }

    if (text.includes('sorry') || text.includes('sad')) {
      return { emotion: 'sympathetic', animation: 'head_tilt' };
    }

    if (text.includes('playful') || text.includes('~')) {
      return { emotion: 'playful', animation: 'tail_swish' };
    }

    if (text.includes('thinking') || text.includes('🤔')) {
      return { emotion: 'curious', animation: 'ear_twitch' };
    }

    // Default: warm, friendly
    return { emotion: 'happy', animation: 'idle_smile' };
  }

  /**
   * Get or create conversation context
   */
  private getOrCreateContext(sessionId: string): ConversationContext {
    let context = this.contextMap.get(sessionId);

    if (!context) {
      context = {
        mode: 'text',
        currentEmotion: 'neutral',
        lastInputType: 'text',
        conversationStyle: 'balanced',
      };
      this.contextMap.set(sessionId, context);
    }

    return context;
  }

  /**
   * Clear conversation context
   */
  clearContext(sessionId: string): void {
    this.contextMap.delete(sessionId);
    logger.info('🎭 Cleared conversation context', { sessionId });
  }

  /**
   * Get current conversation context
   */
  getContext(sessionId: string): ConversationContext | undefined {
    return this.contextMap.get(sessionId);
  }
}
