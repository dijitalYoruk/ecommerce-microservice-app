import axios from 'axios';
import Keys from '../util/keys';
import * as queryString from 'query-string';

export default class FacebookAuth {
   
   public static getAuthURL() {
      const stringifiedParams = queryString.stringify({
         client_id: Keys.FACEBOOK_CLIENT_ID,
         redirect_uri: Keys.FACEBOOK_REDIRECT_URL,
         scope: ['email', 'user_friends'].join(','),
         response_type: 'code',
         auth_type: 'rerequest',
         display: 'popup',
      });

      return `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
   }

   public static async getAccessToken(code: string) {
      const { data } = await axios({
        url: 'https://graph.facebook.com/v4.0/oauth/access_token',
        method: 'get',
        params: {
          client_id: Keys.FACEBOOK_CLIENT_ID,
          client_secret:  Keys.FACEBOOK_CLIENT_SECRET,
          redirect_uri: Keys.FACEBOOK_REDIRECT_URL,
          code,
        },
      });
      return data.access_token;
   };

   public static async getFacebookUserData(access_token: string) {
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name'].join(','),
          access_token
        },
      });
      return data;
    };

}