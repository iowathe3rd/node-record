export interface RecorderOptions {
	/**
	 * Sample rate of the audio (number of samples per second).
	 * Default - 16000
	 */
	sampleRate?: number;

	/**
	 * Number of audio channels (usually 1 for mono and 2 for stereo).
	 * Default - 1
	 */
	channels?: 1 | 2;

	/**
	 * Indicates whether audio compression will be applied.
	 * Default - false
	 */
	compress?: boolean;

	/**
	 * Threshold value for automatic recording stop (only for recording). Value from 0 to 1.
	 * Default - 0.5
	 */
	threshold?: number;

	/**
	 * Automatic stop of recording when silence is detected (if supported).
	 * Default - false
	 */
	endOnSilence?: boolean;

	/**
	 * Duration of silence in seconds before automatic recording stop. Value from 0.0 to 1.0.
	 * Default - 1.0
	 */
	silence?: number;

	/**
	 * Default recording utility (e.g., 'sox').
	 * Default - 'sox'
	 */
	recorder?: 'sox' | 'rec' | 'arecord';

	/**
	 * Audio file type for recording (default is 'wav').
	 */
	audioType?: 'wav' | 'mp3';

	/**
	 * Recording device by default (e.g., 'sox').
	 */
	device?: string | null;

	/**
	 * These fields are used for threshold values for automatic recording stop, do not modify them.
	 */
	thresholdStart?: null;
	thresholdEnd?: null;

	/**
	 * Maximum recording duration in seconds.
	 */
	duration?: number;

	/**
	 * Additional audio file formats.
	 */
	fileType?: 'raw' | 'wav' | 'mp3';

	/**
	 * Path for saving the file (if null, data is passed through the stream).
	 */
	filePath?: string;

	/**
	 * Error callback handler.
	 */
	errorCallback?: (error: Error) => void;

	/**
	 * Enable debug output.
	 */
	debug?: boolean;

	/**
	 * Additional arguments for the recording utility.
	 */
	additionalArgs?: string[];

	/**
	 * Callback triggered when recording starts.
	 */
	onStart?: () => void;

	/**
	 * Callback triggered when recording stops.
	 */
	onStop?: () => void;
}

export interface OtherOptions {
	errorHandler?: (error: any) => any;
	debug?: boolean
}