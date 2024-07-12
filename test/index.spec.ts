import { ChildProcess, spawn } from 'child_process';
import { Readable } from 'stream';
import Recorder from '../src';

jest.mock('child_process', () => ({
  spawn: jest.fn()
}));

jest.mock('stream', () => ({
  Readable: jest.fn().mockImplementation(() => ({
    pause: jest.fn(),
    resume: jest.fn(),
    isPaused: jest.fn()
  }))
}));

describe('Recorder', () => {
  let recorder: Recorder;
  let mockSpawn: jest.Mock;
  let mockReadable: jest.Mock;

  beforeEach(() => {
    mockSpawn = spawn as jest.Mock;
    mockReadable = Readable as unknown as jest.Mock;

    // Reset mocks before each test
    mockSpawn.mockReset();
    mockReadable.mockClear();

    // Mock spawn to return a fake child process
    mockSpawn.mockReturnValue({
      stdout: new Readable(),
      stderr: new Readable(),
      on: jest.fn(),
      kill: jest.fn()
    });

    recorder = new Recorder({
      recorder: 'sox',
      debug: true
    });
  });

  it('should initialize with default options', () => {
    expect(recorder).toBeInstanceOf(Recorder);
  });

  it('should start recording', () => {
    recorder.start();
    expect(mockSpawn).toHaveBeenCalledWith('sox', expect.any(Array));
    expect(recorder.getStream()).not.toBeNull();
  });

  it('should stop recording', () => {
    recorder.start();
    recorder.stop();
    expect(mockSpawn().kill).toHaveBeenCalled();
  });

  it('should pause recording', () => {
    recorder.start();
    recorder.pause();
    expect(mockSpawn().kill).toHaveBeenCalledWith('SIGSTOP');
    expect(recorder.getStream()?.pause).toHaveBeenCalled();
  });

  it('should resume recording', () => {
    recorder.start();
    recorder.pause();
    recorder.resume();
    expect(mockSpawn().kill).toHaveBeenCalledWith('SIGCONT');
    expect(recorder.getStream()?.resume).toHaveBeenCalled();
  });

  it('should return true if recording is paused', () => {
    recorder.start();
    const stream = recorder.getStream();
    if (stream) {
      (stream.isPaused as jest.Mock).mockReturnValue(true);
      expect(recorder.isPaused()).toBe(true);
    }
  });

  it('should return null if no recording process started', () => {
    expect(recorder.getStream()).toBeNull();
  });
});
