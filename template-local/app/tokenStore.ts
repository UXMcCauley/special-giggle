// Simple token storage service
// In a production environment, this should use a secure database or other secure storage

import fs from 'fs';
import path from 'path';
import { logger } from './services/logging';
import { QBTokenResponse } from './lib/quickbooks/refreshToken';

// Directory to store tokens
const TOKEN_DIR = path.join(process.cwd(), 'tokens');

// Flag to track if filesystem is writable
let isFilesystemWritable = true;

// Ensure token directory exists
if (!fs.existsSync(TOKEN_DIR)) {
  try {
    fs.mkdirSync(TOKEN_DIR, { recursive: true });
  } catch (error) {
    logger.warn('Failed to create token directory - filesystem may be read-only:', error);
    isFilesystemWritable = false;
  }
}

/**
 * Get stored tokens for a user
 * @param {string} userId - The user ID
 * @returns {Promise<QBTokenResponse>} The stored tokens
 */
export async function getStoredTokens(userId: string): Promise<QBTokenResponse> {
  const tokenPath = path.join(TOKEN_DIR, `${userId}.json`);

  try {
    if (fs.existsSync(tokenPath)) {
      const tokenData = fs.readFileSync(tokenPath, 'utf8');
      return JSON.parse(tokenData) as QBTokenResponse;
    }
  } catch (error) {
    logger.error(`Error reading tokens for user ${userId}:`, error);
  }

  // If no tokens found or error, return default values from environment
  return {
    access_token: process.env.QB_ACCESS_TOKEN || '',
    refresh_token: process.env.QB_REFRESH_TOKEN || '',
    realmId: process.env.QB_REALM_ID || '',
    expires_in: 3600,
    x_refresh_token_expires_in: 8726400
  };
}

/**
 * Save tokens for a user
 * @param {string} userId - The user ID
 * @param {QBTokenResponse} tokens - The tokens to save
 * @returns {Promise<void>}
 */
export async function saveTokens(userId: string, tokens: QBTokenResponse): Promise<void> {
  // If filesystem is not writable, just log and return without attempting to write
  if (!isFilesystemWritable) {
    logger.info(`Skipping token save for user ${userId} - filesystem is not writable`);
    return;
  }

  const tokenPath = path.join(TOKEN_DIR, `${userId}.json`);

  try {
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
    logger.info(`Tokens saved for user ${userId}`);
  } catch (error) {
    logger.error(`Error saving tokens for user ${userId}:`, error);
    // Mark filesystem as not writable for future calls
    isFilesystemWritable = false;
    // Don't throw error, just log it
    logger.warn('Continuing without saving tokens - will use environment variables instead');
  }
}
