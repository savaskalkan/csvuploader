import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'

class App extends Component {
  render() {
    return (
      <Router>
        <div className='wrapper'>
          <Route exact path="/" component={Login} />
          <Route exact path="/home" component={Home} />
        </div>
      </Router>
    );
  }
}
export default App;
