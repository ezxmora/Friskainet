const fetch = require('node-fetch');
const { challongeUsername, challongeApiKey } = require('@config');

const url = 'https://api.challonge.com/v1/';
const headers = {
  Authorization: `Basic ${Buffer.from(`${challongeUsername}:${challongeApiKey}`).toString('base64')}`,
  'Content-Type': 'application/json',
};

function checkError(res, query) {
  if (res.errors && res.errors.length > 0) {
    throw new Error(`Error while querying challonge ${query}:\n${JSON.stringify(res.errors)}`);
  }
}

module.exports = {
  create: async (name) => {
    const body = {
      tournament: {
        // 60 char max limit on challonge
        name: name.substring(0, 59),
        tournament_type: 'round robin',
      },
    };
    const queryUrl = `${url}tournaments.json`;
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const jsonres = await res.json();
    checkError(jsonres, queryUrl);
    return jsonres;
  },
  // users is an array of objects, check https://api.challonge.com/v1/documents/participants/bulk_add
  // example: {
  //   name: "paco",
  //   misc: "12312312"
  // }
  addParticipants: async (tournamentId, users) => {
    const body = {
      participants: users,
    };
    const queryUrl = `${url}tournaments/${tournamentId}/participants/bulk_add.json`;
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    // Randomize the seeds
    const queryUrlRan = `${url}tournaments/${tournamentId}/participants/randomize.json`;
    const ranres = await fetch(queryUrlRan, {
      method: 'POST',
      headers,
    });
    const jsonres = await res.json();
    const randjsonres = await ranres.json();
    checkError(jsonres, queryUrl);
    checkError(randjsonres, queryUrlRan);
    return jsonres;
  },
  start: async (tournamentId) => {
    const queryUrl = `${url}tournaments/${tournamentId}/start.json`;
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers,
    });
    const jsonres = await res.json();
    checkError(jsonres, queryUrl);
    return jsonres;
  },
  stop: async (tournamentId) => {
    const queryUrl = `${url}tournaments/${tournamentId}/finalize.json`;
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers,
    });
    const jsonres = await res.json();
    checkError(jsonres, queryUrl);
    return jsonres;
  },
};
