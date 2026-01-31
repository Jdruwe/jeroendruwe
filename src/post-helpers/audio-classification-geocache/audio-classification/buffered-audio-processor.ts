class BufferedAudioProcessor extends AudioWorkletProcessor {
    private readonly bufferSize: number;
    private analysisBuffer: Float32Array;
    private bufferPointer: number;

    constructor(options: { processorOptions: { bufferSize: number } }) {
        super();
        this.bufferSize = options.processorOptions.bufferSize;
        this.analysisBuffer = new Float32Array(this.bufferSize);
        this.bufferPointer = 0;
    }

    /**
     * Transferable objects allow you to transfer ownership of an object from one context to another.
     * 'this.analysisBuffer.buffer' gets the underlying ArrayBuffer of the Float32Array.
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects
     */
    private performAnalysis(): void {
        this.port.postMessage({
            type: 'audio',
            data: this.analysisBuffer,
        }, [this.analysisBuffer.buffer]);
    }

    /**
     * this.analysisBuffer is reinitialized as the original instance is detached after transferring it to the main thread.
     */
    private resetBuffer(): void {
        this.analysisBuffer = new Float32Array(this.bufferSize);
        this.bufferPointer = 0;
    }

    /**
     * Currently, audio data blocks are always 128 frames long—that is, they contain 128 32-bit floating-point samples for each of the inputs' channels.
     * However, plans are already in place to revise the specification to allow the size of the audio blocks to be changed depending on circumstances
     * https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process
     */
    private getAudioBlockSize(audio: Float32Array): number {
        return audio.length;
    }

    private getBufferSpaceLeft(): number {
        return this.bufferSize - this.bufferPointer;
    }

    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        _parameters: Record<string, Float32Array>
    ): boolean {
        const input = inputs[0];
        const output = outputs[0];

        if (!input || input.length === 0) {
            return true;
        }

        const inputChannel = input[0];
        const outputChannel = output[0];

        if (inputChannel) {
            for (let i = 0; i < inputChannel.length; ++i) {
                outputChannel[i] = inputChannel[i];
            }

            const audioBlockSize = this.getAudioBlockSize(inputChannel)
            let inputPointer = 0;

            while (inputPointer < audioBlockSize) {
                const bufferSpaceLeft = this.getBufferSpaceLeft();
                const inputSpaceLeft = audioBlockSize - inputPointer;

                const samplesToCopy = Math.min(inputSpaceLeft, bufferSpaceLeft);

                this.analysisBuffer.set(
                    inputChannel.subarray(inputPointer, inputPointer + samplesToCopy),
                    this.bufferPointer
                );

                this.bufferPointer += samplesToCopy;
                inputPointer += samplesToCopy;

                if (this.bufferPointer === this.bufferSize) {
                    this.performAnalysis();
                    this.resetBuffer();
                }
            }
        }

        return true;
    }
}

registerProcessor('buffered-audio-processor', BufferedAudioProcessor);
