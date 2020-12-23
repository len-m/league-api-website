import React from 'react';
import './App.css';
import Nav from './Nav';
import Home from './pages/home/Home.js';
import Myslibros from './pages/league-of-legends/Myslibros';
import LeaguePlayerDetails from './pages/league-of-legends/LeaguePlayerDetails';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/myslibros" component={Myslibros} />
          <Route path="/league-of-legends/:player" component={LeaguePlayerDetails} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;