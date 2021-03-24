import axios from 'axios';
import Keys from '../util/keys';
import { google } from 'googleapis';

interface GoogleUser {
   id: string,
   email: string,
   given_name: string
}

export default class GoogleAuth {

   private static oauth2Client = new google.auth.OAuth2(
      Keys.GOOGLE_CLIENT_ID,
      Keys.GOOGLE_CLIENT_SECRET,
      Keys.GOOGLE_REDIRECT_URL
   );

   public static getGoogleAuthURL() {
      const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ];
   
      return this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes, 
      });
   }
   
   public static async getGoogleUser(code: string) {
      const { tokens } = await this.oauth2Client.getToken(code);
      const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${tokens.id_token}` } })
      return response.data as GoogleUser;
    }
}
