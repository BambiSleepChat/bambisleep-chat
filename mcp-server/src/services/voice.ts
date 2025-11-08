/**
 * Voice Service - Speech-to-Text & Text-to-Speech
 * Integrates OpenAI Whisper (STT) and ElevenLabs (TTS)
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

// ElevenLabs API types
interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  labels: Record<string, string>;
}

interface TTSOptions {
  voice_id?: string;
  model_id?: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface TranscriptionOptions {
  language?: string;
  prompt?: string;
  temperature?: number;
  timestamp_granularities?: ('word' | 'segment')[];
}

interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
  segments?: TranscriptionSegment[];
}

interface TranscriptionSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

interface SynthesisResult {
  audio: Buffer;
  format: 'mp3' | 'wav' | 'pcm';
  duration?: number;
  lipSyncData?: LipSyncData;
}

interface LipSyncData {
  phonemes: Phoneme[];
  duration: number;
}

interface Phoneme {
  phoneme: string;
  startTime: number;
  endTime: number;
}

/**
 * Voice service combining Whisper STT and ElevenLabs TTS
 */
export class VoiceService {
  private openai: OpenAI;
  private elevenLabsApiKey: string;
  private elevenLabsBaseUrl = 'https://api.elevenlabs.io/v1';
  private defaultVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah (friendly, warm female)

  constructor(openaiApiKey: string, elevenLabsApiKey: string) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.elevenLabsApiKey = elevenLabsApiKey;
    logger.info('🎤 VoiceService initialized', {
      whisperEnabled: !!openaiApiKey,
      elevenLabsEnabled: !!elevenLabsApiKey,
    });
  }

  /**
   * Transcribe audio to text using OpenAI Whisper
   * Supports multiple audio formats: mp3, mp4, mpeg, mpga, m4a, wav, webm
   */
  async transcribe(
    audioPath: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    const startTime = Date.now();

    try {
      logger.info('🎤 Starting Whisper transcription', {
        audioPath: path.basename(audioPath),
        language: options.language,
      });

      // Validate file exists
      if (!fs.existsSync(audioPath)) {
        throw new Error(`Audio file not found: ${audioPath}`);
      }

      // Get file stats
      const stats = fs.statSync(audioPath);
      const fileSizeMB = stats.size / (1024 * 1024);

      if (fileSizeMB > 25) {
        throw new Error(
          `Audio file too large: ${fileSizeMB.toFixed(2)}MB (max 25MB)`
        );
      }

      // Create read stream for file
      const audioFile = fs.createReadStream(audioPath);

      // Call Whisper API
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: options.language,
        prompt: options.prompt,
        temperature: options.temperature ?? 0,
        response_format: 'verbose_json', // Get detailed response with segments
      });

      const duration = Date.now() - startTime;

      logger.info('✅ Whisper transcription complete', {
        text: transcription.text.substring(0, 100) + '...',
        language: transcription.language,
        duration: `${duration}ms`,
        fileSizeMB: fileSizeMB.toFixed(2),
      });

      return {
        text: transcription.text,
        language: transcription.language,
        duration,
        segments: transcription.segments as TranscriptionSegment[] | undefined,
      };
    } catch (error: unknown) {
      logger.error('❌ Whisper transcription failed', {
        error: error instanceof Error ? error.message : String(error),
        audioPath: path.basename(audioPath),
      });
      throw error;
    }
  }

  /**
   * Synthesize speech from text using ElevenLabs TTS
   * Returns audio buffer and optional lip-sync data
   */
  async synthesize(
    text: string,
    options: TTSOptions = {}
  ): Promise<SynthesisResult> {
    const startTime = Date.now();

    try {
      const voiceId = options.voice_id ?? this.defaultVoiceId;
      const modelId = options.model_id ?? 'eleven_monolingual_v1';

      logger.info('🔊 Starting ElevenLabs synthesis', {
        text: text.substring(0, 100) + '...',
        voiceId,
        modelId,
      });

      // Prepare voice settings
      const voiceSettings = {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarity_boost ?? 0.75,
        style: options.style ?? 0.0,
        use_speaker_boost: options.use_speaker_boost ?? true,
      };

      // Call ElevenLabs API
      const response = await fetch(
        `${this.elevenLabsBaseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.elevenLabsApiKey,
          },
          body: JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: voiceSettings,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `ElevenLabs API error: ${response.status} - ${errorData}`
        );
      }

      // Get audio buffer
      const audioArrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(audioArrayBuffer);

      const duration = Date.now() - startTime;

      logger.info('✅ ElevenLabs synthesis complete', {
        audioSizeKB: (audioBuffer.length / 1024).toFixed(2),
        duration: `${duration}ms`,
        textLength: text.length,
      });

      return {
        audio: audioBuffer,
        format: 'mp3',
        duration,
      };
    } catch (error: unknown) {
      logger.error('❌ ElevenLabs synthesis failed', {
        error: error instanceof Error ? error.message : String(error),
        textLength: text.length,
      });
      throw error;
    }
  }

  /**
   * Get available ElevenLabs voices
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.elevenLabsBaseUrl}/voices`, {
        headers: {
          'xi-api-key': this.elevenLabsApiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = (await response.json()) as { voices: ElevenLabsVoice[] };
      return data.voices;
    } catch (error: unknown) {
      logger.error('❌ Failed to fetch ElevenLabs voices', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Validate audio file format
   */
  private isValidAudioFormat(filePath: string): boolean {
    const validExtensions = [
      '.mp3',
      '.mp4',
      '.mpeg',
      '.mpga',
      '.m4a',
      '.wav',
      '.webm',
    ];
    const ext = path.extname(filePath).toLowerCase();
    return validExtensions.includes(ext);
  }

  /**
   * Detect voice activity in audio stream (placeholder for future implementation)
   * Would use WebRTC VAD or similar library
   */
  async detectVoiceActivity(audioBuffer: Buffer): Promise<boolean> {
    // TODO: Implement proper VAD using @ricky0123/vad-node or similar
    // For now, simple heuristic based on buffer size
    return audioBuffer.length > 1024;
  }
}
