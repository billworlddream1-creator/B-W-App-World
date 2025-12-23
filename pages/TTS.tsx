
import React, { useState } from 'react';
import { User, AppState } from '../types';
import { aiService } from '../services/geminiService';

interface TTSProps {
  user: User;
  onGenerate: (item: any) => void;
  settings: AppState['systemSettings'];
}

const TTSPage: React.FC<TTSProps> = ({ user, onGenerate, settings }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim() || user.credits <= 0) return;
    setIsGenerating(true);
    try {
      const audioBuffer = await aiService.generateTTS(text);
      
      // Convert buffer to blob for playback and saving
      const wav = audioBufferToWav(audioBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);
      onGenerate({
        type: 'audio',
        prompt: text.substring(0, 100),
        url: url
      });
    } catch (err) {
      console.error(err);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer: AudioBuffer) => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"
    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);  // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded)
    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    for (i = 0; i < buffer.numberOfChannels; i++)
      channels.push(buffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return bufferArray;

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
            <i className="fa-solid fa-microphone-lines text-xl"></i>
          </div>
          <h1 className="text-3xl font-bold">Speech Synth</h1>
        </div>
        <p className="text-slate-400">Convert your text into studio-quality audio instantly.</p>
      </header>

      {!settings.ttsEnabled && (
        <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation"></i>
          <p>This tool is currently disabled by the administrator.</p>
        </div>
      )}

      <div className="glass-morphism rounded-3xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste the text you want to synthesize..."
            className="w-full h-48 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-lg"
          ></textarea>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Limit: 500 characters</span>
            <span>{text.length}/500</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-xs font-mono text-slate-400">Voice: Kore (Natural)</div>
            <div className="p-2 bg-slate-800 rounded-lg text-xs font-mono text-slate-400">Format: WAV</div>
          </div>
          
          <button
            disabled={isGenerating || !text.trim() || user.credits <= 0 || !settings.ttsEnabled}
            onClick={handleGenerate}
            className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isGenerating ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
            }`}
          >
            {isGenerating ? (
              <><i className="fa-solid fa-circle-notch animate-spin"></i> Synthesizing...</>
            ) : (
              <><i className="fa-solid fa-play"></i> Generate Audio</>
            )}
          </button>
        </div>
      </div>

      {audioUrl && (
        <div className="glass-morphism rounded-3xl p-6 animate-in slide-in-from-bottom duration-500">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-green-400"></i> Generation Successful
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <audio controls src={audioUrl} className="flex-1 w-full"></audio>
            <a 
              href={audioUrl} 
              download="omni-speech.wav"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition-all border border-slate-600"
            >
              <i className="fa-solid fa-download mr-2"></i> Download
            </a>
          </div>
        </div>
      )}

      {user.credits <= 0 && (
        <div className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-blue-500/20 rounded-3xl text-center">
          <p className="text-slate-300 font-medium mb-4">You've reached your generation limit.</p>
          <button className="px-6 py-2 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">Upgrade Plan</button>
        </div>
      )}
    </div>
  );
};

export default TTSPage;
