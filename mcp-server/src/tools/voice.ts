/**
 * Voice Tools - MCP tools for speech-to-text and text-to-speech
 */

import { VoiceService } from '../services/voice.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

// Initialize voice service
const openaiApiKey = process.env.OPENAI_API_KEY ?? '';
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY ?? '';

let voiceService: VoiceService | null = null;

if (openaiApiKey && elevenLabsApiKey) {
  voiceService = new VoiceService(openaiApiKey, elevenLabsApiKey);
  logger.info('🎤 Voice tools initialized');
} else {
  logger.warn(
    '⚠️ Voice tools disabled - missing API keys (OPENAI_API_KEY, ELEVENLABS_API_KEY)'
  );
}

/**
 * MCP Tool: Transcribe audio to text using Whisper
 */
export const transcribeAudioTool = {
  name: 'voice_transcribe_audio',
  description:
    'Transcribe speech from an audio file to text using OpenAI Whisper. ' +
    'Supports mp3, mp4, mpeg, mpga, m4a, wav, webm formats. ' +
    'Maximum file size: 25MB. Returns transcribed text and detected language.',
  inputSchema: {
    type: 'object',
    properties: {
      audioPath: {
        type: 'string',
        description:
          'Absolute path to the audio file to transcribe. Must be a valid audio format.',
      },
      language: {
        type: 'string',
        description:
          'Optional ISO-639-1 language code (e.g., "en", "ja", "es"). Improves accuracy if known.',
      },
      prompt: {
        type: 'string',
        description:
          'Optional text prompt to guide transcription style. Useful for technical terms or names.',
      },
    },
    required: ['audioPath'],
  },
  async execute(args: {
    audioPath: string;
    language?: string;
    prompt?: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    if (!voiceService) {
      return {
        content: [
          {
            type: 'text',
            text: '❌ Voice service not initialized. Please set OPENAI_API_KEY and ELEVENLABS_API_KEY environment variables.',
          },
        ],
      };
    }

    try {
      logger.info('🎤 Voice transcription requested', {
        audioPath: path.basename(args.audioPath),
        language: args.language,
      });

      const result = await voiceService.transcribe(args.audioPath, {
        language: args.language,
        prompt: args.prompt,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                transcription: result.text,
                language: result.language,
                duration: result.duration,
                segments: result.segments?.length ?? 0,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: unknown) {
      logger.error('❌ Transcription failed', {
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
                  error instanceof Error
                    ? error.message
                    : 'Unknown transcription error',
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
 * MCP Tool: Synthesize speech from text using ElevenLabs
 */
export const synthesizeSpeechTool = {
  name: 'voice_synthesize_speech',
  description:
    'Synthesize natural speech from text using ElevenLabs TTS. ' +
    'Generates high-quality audio with emotional expression. ' +
    'Returns audio file path and synthesis metadata.',
  inputSchema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description:
          'The text to convert to speech. Can include punctuation for natural pauses.',
      },
      outputPath: {
        type: 'string',
        description:
          'Absolute path where the audio file should be saved (must end in .mp3).',
      },
      voiceId: {
        type: 'string',
        description:
          'Optional ElevenLabs voice ID. Default: Sarah (friendly, warm female voice).',
      },
      emotion: {
        type: 'string',
        enum: ['neutral', 'happy', 'sad', 'excited', 'calm'],
        description:
          'Optional emotion preset that adjusts stability and style parameters.',
      },
      stability: {
        type: 'number',
        description:
          'Voice stability (0.0-1.0). Higher = more consistent, lower = more expressive. Default: 0.5',
        minimum: 0,
        maximum: 1,
      },
      similarityBoost: {
        type: 'number',
        description:
          'Voice similarity boost (0.0-1.0). Higher = closer to original voice. Default: 0.75',
        minimum: 0,
        maximum: 1,
      },
    },
    required: ['text', 'outputPath'],
  },
  async execute(args: {
    text: string;
    outputPath: string;
    voiceId?: string;
    emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm';
    stability?: number;
    similarityBoost?: number;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    if (!voiceService) {
      return {
        content: [
          {
            type: 'text',
            text: '❌ Voice service not initialized. Please set OPENAI_API_KEY and ELEVENLABS_API_KEY environment variables.',
          },
        ],
      };
    }

    try {
      logger.info('🔊 Speech synthesis requested', {
        textLength: args.text.length,
        outputPath: path.basename(args.outputPath),
        emotion: args.emotion,
      });

      // Emotion presets (adjust stability/style based on emotion)
      const emotionPresets = {
        neutral: { stability: 0.5, style: 0.0 },
        happy: { stability: 0.3, style: 0.6 },
        sad: { stability: 0.7, style: 0.2 },
        excited: { stability: 0.2, style: 0.8 },
        calm: { stability: 0.8, style: 0.1 },
      };

      const emotionSettings =
        args.emotion && emotionPresets[args.emotion]
          ? emotionPresets[args.emotion]
          : emotionPresets.neutral;

      const result = await voiceService.synthesize(args.text, {
        voice_id: args.voiceId,
        stability: args.stability ?? emotionSettings.stability,
        similarity_boost: args.similarityBoost ?? 0.75,
        style: emotionSettings.style,
      });

      // Ensure output directory exists
      const outputDir = path.dirname(args.outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write audio to file
      fs.writeFileSync(args.outputPath, result.audio);

      logger.info('✅ Speech synthesis complete', {
        outputPath: args.outputPath,
        audioSizeKB: (result.audio.length / 1024).toFixed(2),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                outputPath: args.outputPath,
                audioSizeKB: (result.audio.length / 1024).toFixed(2),
                format: result.format,
                duration: result.duration,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: unknown) {
      logger.error('❌ Speech synthesis failed', {
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
                  error instanceof Error
                    ? error.message
                    : 'Unknown synthesis error',
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
 * MCP Tool: Get available ElevenLabs voices
 */
export const listVoicesTool = {
  name: 'voice_list_voices',
  description:
    'List all available ElevenLabs voices with their IDs and metadata. ' +
    'Use this to discover voice options before synthesis.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
  async execute(): Promise<{ content: Array<{ type: string; text: string }> }> {
    if (!voiceService) {
      return {
        content: [
          {
            type: 'text',
            text: '❌ Voice service not initialized. Please set OPENAI_API_KEY and ELEVENLABS_API_KEY environment variables.',
          },
        ],
      };
    }

    try {
      const voices = await voiceService.getVoices();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                voices: voices.map((v) => ({
                  voice_id: v.voice_id,
                  name: v.name,
                  labels: v.labels,
                })),
                total: voices.length,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: unknown) {
      logger.error('❌ Failed to list voices', {
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

// Export all voice tools
export const voiceTools = [
  transcribeAudioTool,
  synthesizeSpeechTool,
  listVoicesTool,
];
