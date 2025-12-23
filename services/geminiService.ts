
import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";
import { PresentationDeck } from "../types";

// Base64 helper for image conversion
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

// Base64 to Blob helper
export const base64ToBlob = (base64: string, type: string) => {
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type });
};

// Audio Decoding logic for raw PCM
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Audio decoding implementation following raw PCM data format requirements
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class AIService {
  private async handleRequestError(error: any): Promise<never> {
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes("Requested entity was not found")) {
      console.warn("API Key might lack permissions for this model. Requesting key re-selection.");
      if (typeof (window as any).aistudio?.openSelectKey === 'function') {
        await (window as any).aistudio.openSelectKey();
      }
    }
    throw error;
  }

  async suggestPrompts(type: 'image' | 'video' | 'ppt', currentText?: string): Promise<string[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const context = type === 'image' 
        ? "high-contrast, cinematic, black and white, deep shadows, noir, brutalist, architectural, or artistic image"
        : type === 'video' 
          ? "cinematic motion, slow-motion, dolly zoom, camera panning, atmospheric smoke, or shadow movement video"
          : "business presentation, architectural pitch, cinematic deck, or artistic lecture slides";

      const prompt = currentText 
        ? `Generate 4 creative expansions or variations of this ${type} topic: "${currentText}". Keep the style consistent with a premium ${context} aesthetic.`
        : `Generate 4 unique and creative seed topics for a ${context}. Make them highly descriptive and professional.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "You are a world-class strategist for a premium Black and White AI platform. Return ONLY a JSON array of 4 strings. No markdown, no extra text.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (e) {
      return this.handleRequestError(e);
    }
  }

  async generatePresentation(topic: string, slideCount: number = 8): Promise<PresentationDeck> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `Create a ${slideCount}-slide high-level presentation structure for: "${topic}".` }] }],
        config: {
          systemInstruction: `You are the 'Presentation Architect'. Create cinematic slide deck structures. Each slide must have a title, 3-5 bullet points, and a 'visualDirective' which is a description for a black and white image that matches the slide content. You must generate exactly ${slideCount} slides.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.ARRAY, items: { type: Type.STRING } },
                    visualDirective: { type: Type.STRING }
                  },
                  required: ['title', 'content', 'visualDirective']
                }
              }
            },
            required: ['topic', 'slides']
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      return this.handleRequestError(e);
    }
  }

  async generateTTS(text: string): Promise<AudioBuffer> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio generated");

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const bytes = decodeBase64(base64Audio);
      return await decodeAudioData(bytes, audioCtx);
    } catch (e) {
      return this.handleRequestError(e);
    }
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        },
      });

      if (!response.candidates?.[0]?.content?.parts) throw new Error("Image generation failed");

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in response");
    } catch (e) {
      return this.handleRequestError(e);
    }
  }

  async generateVideo(prompt: string, imageBase64?: string): Promise<string> {
    try {
      if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
        if (!(await (window as any).aistudio.hasSelectedApiKey())) {
          await (window as any).aistudio.openSelectKey();
        }
      }

      const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const payload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Cinematic animation based on this image',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      };

      if (imageBase64) {
        payload.image = {
          imageBytes: imageBase64,
          mimeType: 'image/png'
        };
      }

      let operation = await freshAi.models.generateVideos(payload);
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await freshAi.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed");

      const fetchResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await fetchResponse.blob();
      return URL.createObjectURL(blob);
    } catch (e) {
      return this.handleRequestError(e);
    }
  }
}

export const aiService = new AIService();
