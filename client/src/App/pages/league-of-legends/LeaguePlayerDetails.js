import React, { useEffect, useState } from 'react';
import './LeaguePlayerDetails.css';
import {getRank} from './LeagueOfLegendsApi.js';
/**
 * League player details
 */
function LeaguePlayerDetails(props) {
  const [player, setPlayer] = useState({});

  useEffect(() => {
    const fetchPlayer = async () => {
      const fetchedPlayer = await fetch("http://localhost:3001/api/league-of-legends/players/" + props.match.params.player).then(res => res.json());
      var player = {};
      player.leagueName = fetchedPlayer.summonerInfo.name;
      player.level = fetchedPlayer.summonerInfo.summonerLevel;
      player.IconIdSrc = `//opgg-static.akamaized.net/images/profile_icons/profileIcon${fetchedPlayer.summonerInfo.profileIconId}.jpg?image=q_auto&v=1518361200`;
      player.soloDuoRank = await getRank(fetchedPlayer.leagueInfo, "RANKED_SOLO_5x5");
      player.flexRank = await getRank(fetchedPlayer.leagueInfo, "RANKED_FLEX_SR");
      player.soloDuoRankSrc = `//opgg-static.akamaized.net/images/medals/${player.soloDuoRank}.png?image=q_auto&v=1`;
      player.flexRankSrc = `//opgg-static.akamaized.net/images/medals/${player.flexRank}.png?image=q_auto&v=1`;
      
      const matchList = fetchedPlayer.matchHistory.matches.slice(0, 10);
      
      let matches = [];
      for (var i = 0; i < matchList.length; i++) {
        const rawJsonMatch = await fetch("http://localhost:3001/api/league-of-legends/match/" + matchList[i].gameId).then(res => res.json());
        let match = {};
        match.gameId = rawJsonMatch.matchInfo.gameId;
        //loop through all pariticpants, check if current participant == player
        for (var j = 0; j < rawJsonMatch.matchInfo.participantIdentities.length; j++) {
          const participant = rawJsonMatch.matchInfo.participantIdentities[j];
          if (participant.player.summonerName === player.leagueName) {
            match.win = rawJsonMatch.matchInfo.participants[j].stats.win;
            if (match.win === true) {
              match.winColor = "rgb(102, 163, 255)";
            } else {
              match.winColor = "rgb(255, 77, 77)";
            }
            match.kills = rawJsonMatch.matchInfo.participants[j].stats.kills;
            match.deaths = rawJsonMatch.matchInfo.participants[j].stats.deaths;
            match.assists = rawJsonMatch.matchInfo.participants[j].stats.assists;
            break;
          }
        }
        matches[i] = match;

        console.log(rawJsonMatch);
        //console.log(matches[i]);
      }
      player.matchList = matches;
      setPlayer(JSON.parse(JSON.stringify(player)));
    }
    fetchPlayer();
  }, [props.match.params.player]);

  return (
    <div className="league-player-details-container">
      <div className="player-container">
        <div className="header-container">
          <div className="profile-picture-container">
            <img className="profile-pictrue" src={player.IconIdSrc} alt=""></img>
          </div>
          <div className="player-name-container">
            <h1 className="player-name">{player.leagueName}</h1>
            <h1 className="player-name">Level: {player.level}</h1>
          </div>
          <div className="rank-container">
            <div className="solo-duo-container">
          	  <h1>Solo Duo:</h1>
              <img className="rank-picture" src={player.soloDuoRankSrc} alt=""></img>
            </div>
            <div className="flex-container">
              <h1>Flex:</h1>
              <img className="rank-picture" src={player.flexRankSrc} alt=""></img>
            </div>
          </div>
        </div>
        <div className="body-container">
          <div className="matchlist-container">
            {
              player.matchList && player.matchList.map(match => 
                <div className="match-container" key={`${match.gameId}match-container`}>
                  <div className="win-loose-indicator-container" key={`${match.gameId}win-loose-indicator-container`}>
                    <div className="win-loose-indicator" style={{backgroundColor: match.winColor}} key={`${match.gameId}win-loose-indicator`} />
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaguePlayerDetails;