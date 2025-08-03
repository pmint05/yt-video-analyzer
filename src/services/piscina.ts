import { resolve } from 'node:path';
import Piscina from 'piscina';
import { filename } from '../workers/analyzeWorker';

const piscina = new Piscina({
  filename: resolve(__dirname, '../workers/workerWrapper.js'),
  workerData: {
    fullpath: filename,
  },
});

export default piscina;