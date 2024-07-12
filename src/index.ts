import { OtherOptions, RecorderOptions } from './types/Recorder';
import { error, getDefaultConfig } from './helpers';
import { Readable } from 'stream';
import { ChildProcess, spawn } from 'child_process';
import { loadRecorderConfig } from './recorders';
import logger from './utils/logger';

/**
 * Represents a recorder that can start, stop, pause, and resume recording.
 */
class Recorder {
	private readonly options: RecorderOptions;
	private cmd: string;
	private args: string[];
	private childProcess: ChildProcess | null = null;
	private _stream: Readable | null = null;
	private readonly errorHandler: (error: any) => any;
	private readonly logger = logger;
	private readonly debug: boolean;

	/**
	 * Creates a new instance of the Recorder class.
	 * @param options - The options for the recorder.
	 */
	constructor(options: RecorderOptions & OtherOptions = {}) {
		this.debug = options.debug || false;
		const defaults = getDefaultConfig();
		this.options = { ...defaults, ...options };

		this.errorHandler = this.options.errorCallback || error;

		const { cmd, args } = loadRecorderConfig(
			this.options.recorder || 'sox',
			this.options
		);
		if (!cmd || !args) {
			this.errorHandler('Recorder module is missing required properties.');
			this.cmd = '';
			this.args = [];
		} else {
			this.cmd = cmd;
			this.args = args;
		}
	}

	/**
	 * Starts the recording process.
	 * @returns The current instance of the Recorder.
	 */
	public start(): this {
		if (!this.childProcess) {
			this.childProcess = spawn(this.cmd, this.args);
			const rec = this.childProcess.stdout;
			const err = this.childProcess.stderr;

			this._stream = rec;

			this.childProcess.on('close', (code, signal) => {
				this.logger.debug(`Recording process exited with code ${code} and signal ${signal}`);
				this.childProcess = null;
			});

			err?.on('data', chunk => {
				this.logger.error(`STDERR: ${String(chunk)}`);
			});
			rec?.on('end', () => {
				this.logger.debug('Recording ended');
			});
		} else {
			this.logger.warn('Recording process is already running.');
		}
		return this;
	}

	/**
	 * Stops the recording process.
	 */
	public stop(): void {
		this.terminateProcess('No recording process to stop.');
	}

	/**
	 * Pauses the recording process.
	 */
	public pause(): void {
		this.controlProcess('SIGSTOP', 'Recording paused.', 'Recording not started yet.');
	}

	/**
	 * Resumes the recording process.
	 */
	public resume(): void {
		this.controlProcess('SIGCONT', 'Resumed recording.', 'Recording not started yet.');
	}

	private terminateProcess(warnMessage: string): void {
		if (this.childProcess) {
			this.childProcess.kill();
			this.childProcess = null;
		} else {
			this.logger.warn(warnMessage);
		}
	}

	private controlProcess(signal: NodeJS.Signals, debugMessage: string, warnMessage: string): void {
		if (!this.childProcess) {
			this.logger.warn(warnMessage);
		} else {
			this.childProcess.kill(signal);
			signal === 'SIGSTOP' ? this._stream?.pause() : this._stream?.resume();
			this.logger.debug(debugMessage);
		}
	}

	/**
	 * Checks if the recording process is currently paused.
	 * @returns True if the recording process is paused, false otherwise.
	 */
	public isPaused(): boolean {
		if (!this.childProcess) {
			this.logger.warn('Recording not started yet.');
			return true;
		} else {
			return this._stream?.isPaused() ?? true;
		}
	}

	/**
	 * Gets the readable stream for the recording.
	 * @returns The readable stream for the recording, or null if the recording has not yet started.
	 */
	public getStream(): Readable | null {
		if (!this.childProcess) {
			this.logger.debug('Recording not yet started.');
			return null;
		} else {
			return this._stream;
		}
	}
}

export default Recorder;
