const https = require('https');

module.exports = class Spotify {
  constructor(clientId, clientSecret) {
    this.apiURL = 'api.spotify.com'
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = '';
    this.accessTokenExpiration = '';
  }

  /**
   * Authenticates an user and refreshes the access token expiration date
   * @returns Promise
   */
  async auth() {
    const authToken = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    return new Promise(async(resolve, reject) => {
      const spotifyRequest = await https.request({
        host: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, (response) => {
        let responseData = ''
        response.on('data', (chunk) => {
          responseData = JSON.parse(chunk);
        });
        response.on('end', () => {
          const { expires_in, access_token } = responseData;
          this.accessToken = access_token;

          let currentDate = new Date();
          this.accessTokenExpiration = currentDate.setSeconds(currentDate.getSeconds() + expires_in);
          resolve();
        });
      });

      spotifyRequest.write(new URLSearchParams({"grant_type": "client_credentials"}).toString());
      spotifyRequest.end();
    
      spotifyRequest.on('error', (e) => {
        reject(new Error(`Problem with request: ${e.message}`));
      });
    });
  };

/**
 * Checks if access token expired
 * @returns Boolean
 */
  expired() {
    return this.accessTokenExpiration < new Date()/1000;
  }

  /**
   * Returns all the songs in a playlist or album in an array
   * @param {String} url 
   * @param {Array} [tracks] 
   * @returns Array
   */
  #getTracksPagination(url, tracks = []) {
    return new Promise((resolve, reject) => https.get(url, { headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
      }}, (response) => {
        let responseData = '';
        response.setEncoding('utf-8');
    
        response.on('data', (chunk) => {
          responseData += chunk;
        });
  
        response.on('end', () => {
          const { items, next } = JSON.parse(responseData);
          const parsedItems = items.map(i => i);
          
          if (next) {
            resolve(this.#getTracksPagination(next, [...tracks, ...parsedItems]));
          } else {
            resolve([...tracks, ...parsedItems]);
          }
        });
      }).on('error', (e) => reject(e.message)));
  }

  /**
   * Returns an array of Objects with all the songs on a playlist
   * @param {String} playlistId 
   * @returns Array
   */
  async getPlaylist(playlistId) {
    const tracks = await this.#getTracksPagination(`https://${this.apiURL}/v1/playlists/${playlistId}/tracks`);

    return tracks.map((item) => {
      const {track: { name, artists, duration_ms, id }} = item;
      return {
        name,
        artist: artists.map((n) => n.name).join(' '),
        duration: Math.round(duration_ms / 1000),
        url: `https://open.spotify.com/track/${id}`
      }
    });
  }

  /**
   * Returns an array of object with all the tracks on an album
   * @param {String} albumId 
   * @returns Array
   */
  async getAlbum(albumId) {
    const tracks = await this.#getTracksPagination(`https://${this.apiURL}/v1/albums/${albumId}/tracks`);

    return tracks.map((item) => {
      const { name, artists, duration_ms, id } = item;
      return {
        name,
        artist: artists.map((n) => n.name).join(' '),
        duration: Math.round(duration_ms / 1000),
        url: `https://open.spotify.com/track/${id}`
      }
    });
  }

  /**
   * Returns an object with the track info
   * @param {String} trackId 
   * @returns Object
   */
  async getTrack(trackId) {
    return new Promise((resolve, reject) => https.get(`https://${this.apiURL}/v1/tracks/${trackId}`, { headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
        }}, (response) => {
          let responseData = '';
          response.setEncoding('utf-8');
      
          response.on('data', (chunk) => {
            responseData += chunk;
          });
    
          response.on('end', async () => {
            const { name, artists, duration_ms, id } = JSON.parse(responseData);

            resolve({
              name,
              artists: artists.map((n) => n.name).join(' '),
              duration: Math.round(duration_ms / 1000),
              url: `https://open.spotify.com/track/${id}`
            });

          });
        }).on('error', (e) => reject(e.message)));
  }
}
