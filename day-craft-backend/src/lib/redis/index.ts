import IORedis from 'ioredis';
import { REDIS_URL } from '../../constants';

const connection = new IORedis(REDIS_URL);

export default connection;
