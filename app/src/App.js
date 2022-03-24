import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import CombatSimulator from './pages/combatSimulator/CombatSimulator';
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import RouteWrapper from "./components/routeWrapper/RouteWrapper";
import DefaultLayout from "./layouts/default/Default";
import MainLayout from "./layouts/main/Main";
import Landing from "./components/landing/Landing";
import TurnController from './pages/turnController/TurnController';
import UnitBook from './pages/unitBook/UnitBook';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <RouteWrapper exact path="/" component={ Landing } layout={ DefaultLayout } />
            <RouteWrapper path="/combat" component={ CombatSimulator } layout={ MainLayout }  />
            <RouteWrapper path="/turn" component={ TurnController } layout={ MainLayout }  />
            <RouteWrapper path="/units" component={ UnitBook } layout={ MainLayout }  />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
