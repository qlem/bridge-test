import env from 'env-var';
import * as dotenv from 'dotenv';

// dev
dotenv.config();

export const NODE_ENV = env.get('NODE_ENV').default('development').asString();
export const API_URL = env.get('API_URL').required().asUrlString();
export const API_KEY = env.get('API_KEY').required().asString();