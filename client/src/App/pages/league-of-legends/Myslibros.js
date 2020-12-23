import React from 'react';
import '../../App.css';
import './Myslibros.css';
import LeagueProfile from './LeagueProfile';
import {Link} from 'react-router-dom';

/**
 * Myslibros Screen
 */
function Myslibros() {
  const names = [["µ", "Not Depression", "Protect Jhin"],
                 ["StrongApe", "DunkTown Xpress", "Big Drip 808"], 
                 ["ShirosCloud", "KurosCloud", "eQ Sread"]];
//Warning: Each child in a list should have a unique "key" prop.
    return (
      <div className="myslibros-container">
        <div className="myslibros-header">
          <h1>µslibros</h1>
        </div>
        <div className="myslibros-content-container">
          {
            names.map((rowOfPlayers, index) => 
              <div className={`row-${index + 1}`} key={`row-${index + 1}`}>
                {
                  rowOfPlayers.map(player => 
                      <Link to={`/league-of-legends/${player}`} className="profile-link" key={player}><LeagueProfile leagueName={player}/></Link>
                  )
                }
              </div>
            )
          }
          </div>
      </div>
    );
}

export default Myslibros;