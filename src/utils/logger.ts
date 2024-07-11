import pino from 'pino';

const logger = pino({
    level: 'info', // Set the log level to 'info'
    timestamp: pino.stdTimeFunctions.isoTime, // Use ISO 8601 format for timestamps
    base: null, // Disable adding additional properties to log objects
    messageKey: 'message', // Use 'message' as the key for log messages
    formatters: {
        level: (label) => ({ level: label.toUpperCase() }), // Format log level labels to uppercase
    },
});

export default logger;