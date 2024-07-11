import { RecorderConfigFunction } from './index';

export const recorderConfigSox: RecorderConfigFunction = (options) => {
  const cmd = 'sox';
  const args: string[] = [
    '--default-device',
    '--no-show-progress',                 // show no progress
    '--rate', `${options.sampleRate ?? 16000}`,    // sample rate with a default value
    '--channels', `${options.channels ?? 1}`, // channels with a default value
    '--encoding', 'signed-integer',       // sample encoding
    '--bits', '16',                       // precision (bits)
    '--type', options.audioType ?? 'wav', // audio type with a default value
    '-'
  ];

  if (options.endOnSilence) {
    args.push(
      'silence', '1', '0.1', `${options.thresholdStart || 0.5}%`,
      '1', `${options.silence || 1.0}`, `${options.thresholdEnd || 0.5}%`
    );
  }

  return { cmd, args };
};