// Simple token storage service
// In a production environment, this should use a secure database or other secure storage

import fs from 'fs';
import path from 'path';
import { logger } from './services/logging';

// Directory to store tokens
const TOKEN_DIR = path.join(process.cwd(), 'tokens');

// Ensure token directory exists
if (!fs.existsSync(TOKEN_DIR)) {
  try {
    fs.mkdirSync(TOKEN_DIR, { recursive: true });
  } catch (error) {
    logger.error('Failed to create token directory:', error);
  }
}

/**
 * Get stored tokens for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The stored tokens
 */
export async function getStoredTokens(userId) {
  const tokenPath = path.join(TOKEN_DIR, `${userId}.json`);
  
  try {
    if (fs.existsSync(tokenPath)) {
      const tokenData = fs.readFileSync(tokenPath, 'utf8');
      return JSON.parse(tokenData);
    }
  } catch (error) {
    logger.error(`Error reading tokens for user ${userId}:`, error);
  }
  
  // If no tokens found or error, return default values from environment
  return {
    access_token: process.env.QB_ACCESS_TOKEN || '',
    refresh_token: process.env.QB_REFRESH_TOKEN || '',
    realmId: process.env.QB_REALM_ID || ''
  };
}

/**
 * Save tokens for a user
 * @param {string} userId - The user ID
 * @param {Object} tokens - The tokens to save
 * @returns {Promise<void>}
 */
export async function saveTokens(userId, tokens) {
  const tokenPath = path.join(TOKEN_DIR, `${userId}.json`);
  
  try {
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
    logger.info(`Tokens saved for user ${userId}`);
  } catch (error) {
    logger.error(`Error saving tokens for user ${userId}:`, error);
    throw error;
  }
}