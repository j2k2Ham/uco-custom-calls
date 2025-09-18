import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { AuthCookiePayload } from './authCookie';

export interface StoredUserRecord {
  id: string;
  email: string;
  name?: string;
  passwordHash: string; // bcrypt hash
  provider: 'local';
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

function readAll(): StoredUserRecord[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw) as StoredUserRecord[];
  } catch {
    return [];
  }
}

function writeAll(list: StoredUserRecord[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

export function findUserByEmail(email: string): StoredUserRecord | undefined {
  const all = readAll();
  return all.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, name: string | undefined, password: string): StoredUserRecord {
  const existing = findUserByEmail(email);
  if (existing) throw new Error('Account already exists');
  const now = new Date().toISOString();
  const hash = bcrypt.hashSync(password, 10);
  const record: StoredUserRecord = {
    id: 'su_' + Buffer.from(email).toString('base64'),
    email,
    name,
    passwordHash: hash,
    provider: 'local',
    createdAt: now,
    updatedAt: now
  };
  const all = readAll();
  all.push(record);
  writeAll(all);
  return record;
}

export function verifyPassword(user: StoredUserRecord, password: string): boolean {
  return bcrypt.compareSync(password, user.passwordHash);
}

export function updateUserName(userId: string, name: string): StoredUserRecord | null {
  const all = readAll();
  const idx = all.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  all[idx].name = name;
  all[idx].updatedAt = new Date().toISOString();
  writeAll(all);
  return all[idx];
}

export function changeUserPassword(userId: string, current: string, next: string): void {
  const all = readAll();
  const idx = all.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Not found');
  if (!bcrypt.compareSync(current, all[idx].passwordHash)) throw new Error('Current password invalid');
  all[idx].passwordHash = bcrypt.hashSync(next, 10);
  all[idx].updatedAt = new Date().toISOString();
  writeAll(all);
}

export function toPayload(u: StoredUserRecord): AuthCookiePayload {
  return { id: u.id, email: u.email, name: u.name, provider: u.provider };
}
