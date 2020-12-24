import React, { useEffect, useState } from 'react';
import './LeaguePlayerDetails.css';
import {getRank} from './LeagueOfLegendsApi.js';
/**
 * League player details
 */
function LeaguePlayerDetails(props) {
  const [player, setPlayer] = useState({});

  //declare version and set it to 10.25.1 as a fallback
  let version = "10.25.1";

  const getDDragonCurrentVersion = async () => {
    const rawJSONVersion = await fetch("https://ddragon.leagueoflegends.com/api/versions.json").then(res => res.json());
    return rawJSONVersion[0];
  }
  
  //inefficient => maybe create a file that saves each champion id and their corresponding name and use to write into the file if the champion isnt in there => fallback for new champions 
  const getChampionName = async (id) => {
    const rawJSONDDragon = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/data/de_DE/champion.json`).then(res => res.json());
    let championList = rawJSONDDragon.data;
    for (var i in championList) {
      if (championList[i].key === String(id)) {
        return championList[i].id;
      }
    }
  }
  
  const getSummonerSpellName = async (id) => {
    const rawJSONDDragon = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`).then(res => res.json());
    let summonerSpellList = rawJSONDDragon.data;
    for (var i in summonerSpellList) {
      if (summonerSpellList[i].key === String(id)) {
        return summonerSpellList[i].id;
      }
    }
  }

  useEffect(() => {
    const fetchPlayer = async () => {
      //get newest version
      version = await getDDragonCurrentVersion();
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
        
        //create participant lists
        var participantListPlayerTeam = {"data": []};
        var participantListEnemyTeam = {"data": []};
        for (var k in rawJsonMatch.matchInfo.participants) {
          var participant = {};
          participant.stats = rawJsonMatch.matchInfo.participants[k];
          participant.identity = rawJsonMatch.matchInfo.participantIdentities.find(item => item.participantId === participant.stats.participantId);
          if (participant.stats.teamId === 100) {
            participantListPlayerTeam.data.push(participant);
          } else {
            participantListEnemyTeam.data.push(participant);
          }
          participant.championName = await getChampionName(participant.stats.championId);
          participant.championSrc = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participant.championName}.png`;
        }
        match.participantListPlayerTeam = participantListPlayerTeam;
        match.participantListEnemyTeam = participantListEnemyTeam;

        console.log(match);

        //loop through all pariticpants, check if current participant === player
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

            match.championPlayedByName = await getChampionName(rawJsonMatch.matchInfo.participants[j].championId);
            match.championPlayedSrc = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${match.championPlayedByName}.png`;

            match.summonerSpell1ByName = await getSummonerSpellName(rawJsonMatch.matchInfo.participants[j].spell1Id);
            match.summonerSpell2ByName = await getSummonerSpellName(rawJsonMatch.matchInfo.participants[j].spell2Id);
            match.summonerSpell1Src = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${match.summonerSpell1ByName}.png`;
            match.summonerSpell2Src = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${match.summonerSpell2ByName}.png`;

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
                  <div className="champion-summonerspells-container" key={`${match.gameId}champion-summonerspells-container`}>
                    <div className="own-champion-container" key={`${match.gameId}own-champion-container`}>
                      <img className="own-champion" src={match.championPlayedSrc} alt="" />
                    </div>
                    <div className="summonerspells-container" key={`${match.gameId}summonerspells-container`}>
                      <img className="summonerspell" src={match.summonerSpell1Src} alt="" />
                      <img className="summonerspell" src={match.summonerSpell2Src} alt="" />
                    </div>
                  </div>
                  <div className="kda-container">
                    <h1 className="kda">{match.kills}:{match.deaths}:{match.assists}</h1>
                  </div>
                  <div className="participantList-full-container" key={`${match.gameId}participantList-container`}>
                    <div className="participantList-container" key={`${match.gameId}participantList-PlayerTeam-container`}>
                      {
                        match.participantListPlayerTeam.data && match.participantListPlayerTeam.data.map(participant =>
                          <div className="participant-container" key={`${match.gameId}${participant.identity.player.summonerName}participant-containerPlayerTeam`}>
                            <img className="participantChampion" src={participant.championSrc} alt="" />
                            <h1 className="participantName">{participant.identity.player.summonerName}</h1>
                          </div>
                        )
                      }
                    </div>
                    <div className="participantList-container" key={`${match.gameId}participantList-EnemyTeam-container`}>
                      {
                        match.participantListEnemyTeam.data && match.participantListEnemyTeam.data.map(participant =>
                          <div className="participant-container" key={`${match.gameId}${participant.identity.player.summonerName}participant-containerEnemyTeam`}>
                            <img className="participantChampion" src={participant.championSrc} alt="" />
                            <h1 className="participantName">{participant.identity.player.summonerName}</h1>
                          </div>
                        )
                      }
                    </div>

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