import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/Auth';
import Events from './pages/Events';
import Bookings  from './pages/Bookings';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact/>
          <Route path="/auth" component={AuthPage}/>
          <Route path="/event" component={Events}/>
          <Route path="/bookings" component={Bookings}/>
        </Switch>

      <div id="App"></div>
      </BrowserRouter> 
    );
  }
}

export default App;
