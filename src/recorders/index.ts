import { RecorderOptions } from '../types/Recorder';
import { recorderConfigSox } from './sox';

interface RecorderConfig {
  cmd: string;
  args: string[];
}

export type RecorderConfigFunction = (options: RecorderOptions) => RecorderConfig;

const recorderConfigMap: Record<string, RecorderConfigFunction> = {
  'sox': recorderConfigSox,
  // Add entries for other recorders if available
};

export const loadRecorderConfig = (recorder: string, options: RecorderOptions): RecorderConfig => {
  const recorderConfigFunction = recorderConfigMap[recorder];
  if (!recorderConfigFunction) {
    throw new Error(`Unknown recorder: ${recorder}`);
  }

  return recorderConfigFunction(options);
};