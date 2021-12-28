import morgan, { StreamOptions } from 'morgan'
import Logger from '../utils/Logger'
import config from 'config'

const stream: StreamOptions = {
    write: (message) => Logger.http(message),
};

const skip = () => {
    const env = config.get('env.development')
    return env !== true;
};

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip }
);

export default morganMiddleware;
