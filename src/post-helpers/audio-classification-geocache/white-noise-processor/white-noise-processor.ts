class WhiteNoiseProcessor extends AudioWorkletProcessor {
  /**
   * The process method is called every 128 samples (approx. every 2.6ms at 48kHz).
   * @param {Array} inputs - An array of input ports (each containing channel arrays).
   * @param {Array} outputs - An array of output ports (each containing channel arrays).
   */
  process(inputs, outputs) {
    // todo: fix typescript issues!
    // The first input is usually our microphone source
    const input = inputs[0];
    // The first output is our destination (e.g., speakers)
    const output = outputs[0];

    /**
     * OUTER LOOP: Channels
     * Most speakers are Stereo (2 channels: 0=Left, 1=Right).
     * We loop through the output channels to ensure we fill every speaker.
     */
    for (let channel = 0; channel < output.length; channel++) {
      const outputChannel = output[channel];

      /**
       * UPMIXING LOGIC:
       * If we have a mono microphone (1 channel), input[1] will be undefined.
       * By falling back to input[0], we duplicate the mono signal into both
       * the left and right speakers for a balanced sound.
       */
      const inputChannel = input[channel] || input[0];

      /**
       * PERFORMANCE OPTIMIZATION:
       * We check for the existence of the inputChannel once per block (128 samples)
       * rather than checking it 128 times inside the inner loop.
       */
      if (inputChannel) {
        /**
         * INNER LOOP: Samples
         * We iterate through the 128 floating-point samples in this block.
         */
        for (let i = 0; i < outputChannel.length; i++) {
          /**
           * NOISE GENERATION:
           * Math.random() generates 0 to 1.
           * We scale it to -1.0 to 1.0 (the standard audio range).
           * We multiply by 0.05 to keep the noise at 5% volume.
           */
          const noise = (Math.random() * 2 - 1) * 0.05;

          /**
           * GAIN STAGING & MIXING:
           * We multiply the mic input by 0.9 to give it "headroom."
           * (Mic * 0.9) + (Noise * 0.05) = Max 0.95.
           * This ensures the combined sum never exceeds 1.0, preventing
           * harsh digital distortion known as "clipping."
           */
          outputChannel[i] = inputChannel[i] * 0.9 + noise;
        }
      } else {
        /**
         * FALLBACK:
         * If no microphone input is detected (e.g., stream not yet started),
         * we fill the output with only the white noise.
         */
        for (let i = 0; i < outputChannel.length; i++) {
          outputChannel[i] = (Math.random() * 2 - 1) * 0.05;
        }
      }
    }

    // Always return true to keep the audio thread active.
    return true;
  }
}
registerProcessor('white-noise-processor', WhiteNoiseProcessor);
