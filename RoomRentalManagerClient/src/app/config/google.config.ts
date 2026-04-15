/**
 * Google OAuth Configuration
 * Replace GOOGLE_CLIENT_ID with your actual Google Client ID from Google Cloud Console
 */
export const GOOGLE_CONFIG = {
  /**
   * Google Client ID from Google Cloud Console
   * https://console.cloud.google.com/apis/credentials
   */
  clientId: '108140565716-hcsimngdaqi8b93u549pagacpcdg1l1a.apps.googleusercontent.com',

  /**
   * Scopes requested from Google
   */
  scopes: 'email profile',

  /**
   * Cookie policy for Google Sign-In
   */
  cookiePolicy: 'single_host_origin'
};
