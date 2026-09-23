/**
 * Procedural Web Audio API sound generator for noir detective ambiance.
 * Zero external audio assets required, guaranteed browser compatibility.
 */

class NoirAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rainNode: AudioNode | null = null;
  private isAmbiancePlaying: boolean = false;

  constructor() {
    const saved = localStorage.getItem('detective_audio_muted');
    this.isMuted = saved === 'true';
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('detective_audio_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopAmbiance();
    } else {
      this.startAmbiance();
    }
    return this.isMuted;
  }

  /**
   * Starts subtle rainy noir background ambiance using filtered white noise
   */
  public startAmbiance() {
    if (this.isMuted || this.isAmbiancePlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 450;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.04; // Gentle background whisper

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.rainNode = noise;
      this.isAmbiancePlaying = true;
    } catch {
      // Audio autoplay policy
    }
  }

  public stopAmbiance() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
        this.rainNode.disconnect();
      } catch {
        // Ignored
      }
      this.rainNode = null;
    }
    this.isAmbiancePlaying = false;
  }

  /**
   * Typewriter key stroke click sound
   */
  public playTypewriterClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 60, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }

  /**
   * Dramatic contradiction discovered chime (Minor diminished chord sting)
   */
  public playContradictionChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [220, 261.63, 311.13, 440]; // A minor diminished chord
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + 1.2);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Evidence discovered golden chime
   */
  public playEvidenceChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + index * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + index * 0.08);
        osc.stop(this.ctx.currentTime + index * 0.08 + 0.8);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Dramatic gavel strike for Accusation
   */
  public playGavelStrike() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch {
      // Ignore
    }
  }
}

export const sound = new NoirAudioService();
