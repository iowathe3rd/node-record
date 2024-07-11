import { RecorderOptions } from './types/Recorder';

export const getDefaultConfig = (): RecorderOptions => {
  return {
    sampleRate: 16000,          // Default sample rate
    channels: 1,                // Default number of channels (mono)
    compress: false,            // Default compression setting
    threshold: 0.5,             // Default threshold for automatic recording stop
    endOnSilence: false,        // Default setting for automatic stop on silence
    silence: 1.0,               // Default duration of silence before automatic stop
    recorder: 'sox',            // Default recording utility
    audioType: 'wav',           // Default audio file type
    device: null,               // Default recording device
    thresholdStart: null,       // Default threshold start value
    thresholdEnd: null,         // Default threshold end value
    duration: undefined,        // Default maximum recording duration (undefined for no limit)
    fileType: 'wav',            // Default audio file type for recording
    errorCallback: undefined,   // Default error callback
    debug: false,               // Default debug setting
    additionalArgs: [],         // Default additional arguments for the recording utility
    onStart: undefined,         // Default callback triggered when recording starts
    onStop: undefined           // Default callback triggered when recording stops
  };
};




export const error = (error: string): never => {
  throw new Error(error)
}

