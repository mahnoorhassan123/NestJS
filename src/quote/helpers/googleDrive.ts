import { Injectable } from '@nestjs/common';
import fs = require('fs');
import GoogleAuth = require('google-auth-library');

@Injectable()
export class GoogleDriveService {
  private SCOPES = ['https://www.googleapis.com/auth/drive'];
  private TOKEN_DIR =
    (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
    '/.credentials/';
  private TOKEN_PATH = this.TOKEN_DIR + 'drive-nodejs-quickstart.json';

  retrieveNewToken(code, callbackUrl, callback) {
    fs.readFile('client_secret.json', (err, content) => {
      if (err) {
        console.log(new Date(), 'Error loading client secret file: ', err);
        return;
      }
      var credentials = JSON.parse(content.toString());
      var clientSecret = credentials.web.client_secret;
      var clientId = credentials.web.client_id;
      var redirectUrl = callbackUrl;
      var auth = new GoogleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.log(
            new Date(),
            'Error while trying to retrieve access token',
            err,
          );
          callback();
        }
        oauth2Client.credentials = token;
        this.storeToken(token, callback);
      });
    });
  }

  storeToken(token, callback) {
    try {
      if (!fs.existsSync(this.TOKEN_DIR)) {
        fs.mkdirSync(this.TOKEN_DIR, { recursive: true });
      }
      fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(token));
      callback();
    } catch (err) {
      console.error(`Error storing token: ${err.message}`);
      throw err;
    }
    fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(token));
    callback();
  }
}
