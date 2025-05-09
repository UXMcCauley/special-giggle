// src/services/google-workspace.ts
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';
import { logger } from './logging';

class GoogleWorkspaceService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      config.googleWorkspace.clientId,
      config.googleWorkspace.clientSecret,
      config.googleWorkspace.redirectUri
    );

    // Set credentials if available
    if (config.googleWorkspace.accessToken) {
      this.oauth2Client.setCredentials({
        access_token: config.googleWorkspace.accessToken,
        refresh_token: config.googleWorkspace.refreshToken,
        expiry_date: config.googleWorkspace.expiresAt
      });
    }

    logger.info('Google Workspace service initialized');
  }

  // Generate authorization URL
  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    });
  }

  // Exchange code for tokens
  async getTokensFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // Refresh token
  async refreshTokens() {
    try {
      const result = await this.oauth2Client.refreshAccessToken();
      const tokens = result.credentials;
      return tokens;
    } catch (error) {
      logger.error('Failed to refresh Google tokens:', error);
      throw error;
    }
  }

  // Sample method to get calendar events
  async getCalendarEvents() {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  // Sample method to search Drive files
  async searchDriveFiles(query: string) {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      const response = await drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, webViewLink)',
        spaces: 'drive',
      });
      return response.data.files;
    } catch (error) {
      logger.error('Error searching Drive files:', error);
      throw error;
    }
  }

  // Gmail methods
  async getGmailMessages(maxResults = 10) {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults
      });

      // If no messages, return empty array
      if (!response.data.messages) {
        return [];
      }

      // Get full message details for each message
      const messages = await Promise.all(
        response.data.messages.map(async (message) => {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: message.id!
          });
          return fullMessage.data;
        })
      );

      return messages;
    } catch (error) {
      logger.error('Error fetching Gmail messages:', error);
      throw error;
    }
  }

  async searchGmailMessages(query: string, maxResults = 10) {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: maxResults
      });

      // If no messages, return empty array
      if (!response.data.messages) {
        return [];
      }

      // Get full message details for each message
      const messages = await Promise.all(
        response.data.messages.map(async (message) => {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: message.id!
          });
          return fullMessage.data;
        })
      );

      return messages;
    } catch (error) {
      logger.error('Error searching Gmail messages:', error);
      throw error;
    }
  }

  // Google Sheets methods
  async createSpreadsheet(title: string) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: title
          }
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  async getSpreadsheetValues(spreadsheetId: string, range: string) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range
      });

      return response.data;
    } catch (error) {
      logger.error('Error getting spreadsheet values:', error);
      throw error;
    }
  }

  async updateSpreadsheetValues(spreadsheetId: string, range: string, values: any[][]) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: values
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Error updating spreadsheet values:', error);
      throw error;
    }
  }
}

export const googleWorkspaceService = new GoogleWorkspaceService();
