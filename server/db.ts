import crypto from 'crypto';

// Mock Database State
export const usersDB: any[] = [];
export const testsDB: any[] = [];

// Password Helpers
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === verifyHash;
}

// Initial Admin
const { salt, hash } = hashPassword('admin123');
usersDB.push({
  id: '1',
  username: 'admin',
  salt,
  passwordHash: hash,
  avatar: 'default.png',
  role: 'admin'
});
