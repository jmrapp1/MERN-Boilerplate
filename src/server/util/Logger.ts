import * as winston from 'winston';
import * as StreamLoggerModule from 's3-streamlogger';
import * as DateUtils from './DateUtils';

class Logger {

    s3Stream;
    transport;
    private logger;

    setup() {
        if (this.logS3Enabled()) {
            this.s3Stream = new StreamLoggerModule.S3StreamLogger({
                bucket: process.env.S3_LOG_BUCKET_NAME,
                access_key_id: process.env.AWS_ACCESS_KEY_ID,
                secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
            });

            this.transport = new (winston.transports.File)({
                stream: this.s3Stream
            });

            this.transport.on('error', err => console.error(err));

            this.logger = new (winston.Logger)({
                transports: [this.transport]
            });
            console.log('S3 Logging enabled.');
        } else {
            console.log('S3 Logging is disabled');
        }
        console.log('Logger finished setup');
    }

    info(msg) {
        if (this.logS3Enabled()) {
            this.logger.info(msg);
        }
        console.log(`[INFO ${DateUtils.now()}] ${msg}`);
    }

    warn(msg) {
        if (this.logS3Enabled()) {
            this.logger.warn(msg);
        }
        console.warn(`[WARN ${DateUtils.now()}] ${msg}`);
    }

    error(msg) {
        if (this.logS3Enabled()) {
            this.logger.error(msg);
        }
        console.error(`[ERROR ${DateUtils.now()}] ${msg}`);
    }

    critical(msg) {
        if (this.logS3Enabled()) {
            this.logger.error(msg);
        }
        console.error(`[CRITICAL ${DateUtils.now()}] ${msg}`);
    }

    private logS3Enabled() {
        return process.env.LOG_S3 === true || process.env.LOG_S3 === 'true';
    }

}

export default new Logger();
