class WhiteNoiseProcessor extends AudioWorkletProcessor {
  /**
   * The process method is called every 128 samples (approx. every 2.6ms at 48kHz).
   * @param {Array} inputs - An array of input ports (each containing channel arrays).
   * @param {Array} outputs - An array of output ports (each containing channel arrays).
   */
  process(inputs: Float32Array[][], outputs: Float32Array[][]) {
    const input = inputs[0]; // microphone input
    const output = outputs[0]; // speaker output

    /**
     * Most speakers are Stereo (2 channels: 0=Left, 1=Right).
     * We loop through the output channels to ensure we fill every speaker.
     */
    for (let channel = 0; channel < output.length; channel++) {
      const outputChannel = output[channel];

      /**
       * Fallback in case of a mono input.
       */
      const inputChannel = input[channel] || input[0];

      if (inputChannel) {
        /**
         * Iterating through the 128 floating-point samples in this block.
         */
        for (let i = 0; i < outputChannel.length; i++) {
          /**
           * Noise generation:
           * Math.random() generates 0 to 1.
           * Scale to -1.0 to 1.0 (the standard audio range).
           * Multiply by 0.05 to keep the noise at 5% volume.
           */
          const noise = (Math.random() * 2 - 1) * 0.05;

          /**
           * Mixing & preventing clipping:
           * Multiply the mic input by 0.9 to give it "headroom."
           * (Mic * 0.9) + (Noise * 0.05) = Max 0.95.
           */
          outputChannel[i] = inputChannel[i] * 0.9 + noise;
        }
      }
    }

    return true;
  }
}
registerProcessor('white-noise-processor', WhiteNoiseProcessor);
