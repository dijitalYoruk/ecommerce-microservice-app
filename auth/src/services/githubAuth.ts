import axios from 'axios';
import Keys from '../util/keys';
import * as queryString from 'query-string';

export default class FacebookAuth {
  
   public static getAuthURL() {
      const params = queryString.stringify({
         client_id: Keys.GITHUB_CLIENT_ID,
         redirect_uri: Keys.GITHUB_REDIRECT_URL,
         scope: ['read:user', 'user:email'].join(' '),
         allow_signup: true,
      });

      return `https://github.com/login/oauth/authorize?${params}`;
   }

   public static async getAccessToken(code: string) {
      const { data } = await axios({
         url: 'https://github.com/login/oauth/access_token',
         method: 'get',
         params: {
            client_id: Keys.GITHUB_CLIENT_ID,
            client_secret: Keys.GITHUB_CLIENT_SECRET,
            redirect_uri: Keys.GITHUB_REDIRECT_URL,
            code,
         },
      });

      const parsedData = queryString.parse(data);
      return parsedData.access_token as string;
   }

   public static async getUserData(accessToken: string) {
      const { data } = await axios({
         url: 'https://api.github.com/user',
         method: 'get',
         headers: { Authorization: `token ${accessToken}` },
      });

      if (data.email) {
         return data;
      }

      const { data: dataEmails } = await axios({
         url: 'https://api.github.com/user/emails',
         method: 'get',
         headers: {
            Authorization: `token ${accessToken}`,
         },
      });

      return { ...data, email: dataEmails[0].email };
   }
}
