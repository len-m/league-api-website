import React, { useState } from 'react';
import '../../App.css';

/**
 * Home screen
 */
function Home() {

    const [summoner, setSummoner] = useState({});
    let action = `/league-of-legends/${summoner}`;

  return (
    <div className="search-container">
        <form className="search-form" action={action}>
            <input className="text-input" type="text" onChange={textfield => setSummoner(textfield.target.value)} placeholder="Summonername"></input>
            <button className="submit-button" type="submit">GO</button>
        </form>
    </div>
  );
}

export default Home;