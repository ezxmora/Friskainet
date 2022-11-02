const { request } = require('undici');

module.exports = {
  getBoobs: async () => {
    const { body } = await request('http://api.oboobs.ru/boobs/0/1/random');
    const res = await body.json();
    return res[0];
  },

  getButts: async () => {
    const { body } = await request('http://api.obutts.ru/butts/0/1/random');
    const res = await body.json();
    return res[0];
  },
};
