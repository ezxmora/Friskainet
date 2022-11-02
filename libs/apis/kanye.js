const { request } = require('undici');

const url = 'https://api.kanye.rest';

module.exports = {
  get: async () => {
    const { body } = await request(url);
    const { quote } = await body.json();

    return quote;
  },
};
