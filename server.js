//const riotApi = require('./leagueoflegendsapi.js');
const express = require('express');
const bodyParser = require('body-parser');
var cache = require('memory-cache');
const fetch = require('node-fetch');
const encodeUrl = require('encodeurl');
require('dotenv/config');
const app = express();
const cacheStoreTime = 100000// in ms
var matchCache = new cache.Cache();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

/**
 * fetches json from riot api request
 * 
 * @param {String} url 
 * @return json fetched json
 */
const riotApiFetch = async (url) => {
  const base_url = 'https://euw1.api.riotgames.com/lol/';
  const key_url = `?api_key=${process.env.RIOT_API_KEY}`;
  const full_url = `${base_url}${url}${key_url}`;
  const rawData = await fetch(encodeUrl(full_url));
  const json = await rawData.json();
  return json;
}

/**
 * gets league of legends stats of a specific player
 * puts the stats into cache for a specific amount of time to reduce REST API calls
 */
app.get('/api/league-of-legends/players/profile-info/:player', async function(req, res) {
  if (cache.get(req.params.player) === null) {
    //player is not in cache
    try {
      //try adding player to cache
      const summonerInfo = await riotApiFetch(`summoner/v4/summoners/by-name/${req.params.player}`);
      const leagueInfo = await riotApiFetch(`league/v4/entries/by-summoner/${summonerInfo.id}`);
      var player = {};
      player.summonerInfo = summonerInfo;
      player.leagueInfo = leagueInfo;
      const playerJSON = JSON.parse(JSON.stringify(player)); 
      cache.put(req.params.player, playerJSON, cacheStoreTime);
    } catch (err) {
      console.log(err);
      //err handling
    }
  }
  res.json(cache.get(req.params.player));
});

/**
 * 
 */
app.get('/api/league-of-legends/players/:player', async function(req, res) {
  try {
    if (cache.get(req.params.players) === null) {
      //player is not in cache
      const summonerInfo = await riotApiFetch(`summoner/v4/summoners/by-name/${req.params.player}`);
      const leagueInfo = await riotApiFetch(`league/v4/entries/by-summoner/${summonerInfo.id}`);
      const matchHistory = await riotApiFetch(`match/v4/matchlists/by-account/${summonerInfo.accountId}`);
      var player = {};
      player.summonerInfo = summonerInfo;
      player.leagueInfo = leagueInfo;
      player.matchHistory = matchHistory;
      const playerJSON = JSON.parse(JSON.stringify(player)); 
      cache.put(req.params.player, playerJSON, cacheStoreTime);
    } else {
      player = cache.get(req.params.players);
      if (player.matchHistory === undefined) {
        //only summonerInfo and leagueInfo is in cache 
        player.matchHistory = await riotApiFetch(`match/v4/matchlists/by-account/${player.summonerInfo.accountId}`);
        const playerJSON = JSON.parse(JSON.stringify(player));
        cache.put(req.params.player, playerJSON, cacheStoreTime);
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.json(cache.get(req.params.player));
});

app.get('/api/league-of-legends/match/:matchId', async function(req, res) {
  try {
    if (matchCache.get(req.params.matchId) === null) {
      const matchInfo = await riotApiFetch(`match/v4/matches/${req.params.matchId}`);
      var match = {};
      match.matchInfo = matchInfo;
      const matchJSON = JSON.parse(JSON.stringify(match));
      matchCache.put(req.params.matchId, matchJSON);
    }
  } catch (err) {
    console.log(err);
  }
  res.json(matchCache.get(req.params.matchId));
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});