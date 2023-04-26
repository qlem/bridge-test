import axios from 'axios';
import { API_URL, API_KEY } from '../env';

const client = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    }
});

export { client };
