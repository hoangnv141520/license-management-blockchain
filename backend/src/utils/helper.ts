import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export const normalizeFilePath = (dbPath: string): string => {
  let cleanPath = dbPath.replace(/\\/g, '/');
  cleanPath = cleanPath.replace(/^\.\.\//, '').replace(/^\.\//, '');
  return path.normalize(path.join('..', cleanPath));
};

export const calculateDataHash = (...args: string[]): string => {
  const hash = crypto.createHash('sha256');
  args.forEach((arg) => hash.update(arg));
  return hash.digest('hex');
};

export const calculateFileHash = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};
