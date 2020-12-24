import React from 'react';
import './App.css';
import Nav from './Nav';
import Myslibros from './pages/league-of-legends/Myslibros';
import LeaguePlayerDetails from './pages/league-of-legends/LeaguePlayerDetails';
import Search from './pages/search/Search';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Search} />
          <Route path="/myslibros" component={Myslibros} />
          <Route path="/league-of-legends/:player" component={LeaguePlayerDetails} />
          <Route path="/search" component={Search} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;