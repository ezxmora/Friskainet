const { request } = require('undici');

const url = 'https://api.urbandictionary.com/v0/define?';

module.exports = {
  get: async (term) => {
    const query = new URLSearchParams({ term });
    const result = await request(`${url}${query}`);
    const { list } = await result.body.json();

    if (list.length) {
      const {
        word, definition, thumbs_up, permalink, author,
      } = list[0];

      return {
        word,
        description: definition.replace(/[[\]']+/g, ''),
        thumbsUp: thumbs_up,
        permalink,
        author,
      };
    }

    return false;
  },
};
