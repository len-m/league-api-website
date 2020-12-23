import React, { useEffect, useState } from 'react';
import './Myslibros.css';
import {getRank} from './LeagueOfLegendsApi.js';

/**
 * League player profile for Myslibros
 */
function LeagueProfile(props) {
    const [player, setPlayer] = useState({});
    
    useEffect(() => {
        const fecthPlayer = async () => {
            const fetchedPlayer = await fetch("http://localhost:3001/api/league-of-legends/players/profile-info/" + props.leagueName).then(res => res.json());
            var player = {};
            player.leagueName = fetchedPlayer.summonerInfo.name;
            player.level = fetchedPlayer.summonerInfo.summonerLevel;
            player.IconIdSrc = `//opgg-static.akamaized.net/images/profile_icons/profileIcon${fetchedPlayer.summonerInfo.profileIconId}.jpg?image=q_auto&v=1518361200`;
            player.soloDuoRank = await getRank(fetchedPlayer.leagueInfo, "RANKED_SOLO_5x5");
            player.flexRank = await getRank(fetchedPlayer.leagueInfo, "RANKED_FLEX_SR");
            player.soloDuoRankSrc = `//opgg-static.akamaized.net/images/medals/${player.soloDuoRank}.png?image=q_auto&v=1`;
            player.flexRankSrc = `//opgg-static.akamaized.net/images/medals/${player.flexRank}.png?image=q_auto&v=1`;
            
            setPlayer(JSON.parse(JSON.stringify(player)));
        }
        fecthPlayer();
    }, [props.leagueName]);


    return (
        <div className="league-profile">
            <div className="league-profile-header">
                <div className="league-profile-header-picture-container">
                    <img className="league-profile-picture" src={player.IconIdSrc} alt=""></img>
                </div>
                <div className="league-profile-header-text">
                    <h1>{player.leagueName}</h1>
                    <h1>Level: {player.level}</h1>
                </div>
            </div>
            <div className="league-info">
                <div className="soloDuo-container">
                    <h1>Solo Duo</h1>
                    <img className="rank-picture" src={player.soloDuoRankSrc} alt=""></img>
                </div>
                <div className="flex-container">
                    <h1>Flex</h1>
                    <img className="rank-picture" src={player.flexRankSrc} alt=""></img>
                </div>
            </div>
        </div>
    );
}

export default LeagueProfile;