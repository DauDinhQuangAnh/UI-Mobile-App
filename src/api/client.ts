import axios from 'axios';

const client = axios.create({
  baseURL: 'http://10.45.6.109:8989',
});

export default client;
