'use client';

/**
 * Utilitário para reproduzir sons de notificação
 * Gera sons usando Web Audio API
 */

class NotificationSoundGenerator {
  constructor() {
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  /**
   * Som simples de notificação - dois beeps curtos
   */
  playSimpleNotification() {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Primeiro beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.frequency.value = 800;
    osc1.type = 'sine';

    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc1.start(now);
    osc1.stop(now + 0.1);

    // Segundo beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.frequency.value = 1000;
    osc2.type = 'sine';

    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc2.start(now + 0.15);
    osc2.stop(now + 0.25);
  }

  /**
   * Som de alerta - três beeps rápidos
   */
  playAlertNotification() {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const beepDuration = 0.08;
    const gap = 0.05;

    for (let i = 0; i < 3; i++) {
      const startTime = now + i * (beepDuration + gap);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 1200 + i * 200; // Frequência aumenta a cada beep
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + beepDuration);

      osc.start(startTime);
      osc.stop(startTime + beepDuration);
    }
  }

  /**
   * Reproduz o som apropriado baseado no tipo
   */
  play(soundType) {
    // Resume audio context se necessário (policy de autoplay)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (soundType === 'notification-alert') {
      this.playAlertNotification();
    } else {
      this.playSimpleNotification();
    }
  }
}

// Exportar singleton
const soundGenerator = new NotificationSoundGenerator();

export default soundGenerator;
