import React from 'react';

import { Redirect, Switch, Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

import Landing from './pages/Landing'

import './App.css';

// Import global css
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    console.log("ReRender")
    return (
      <Switch>
        <Route path={`${this.props.match.path}:id`} 
          render={(props) => (<Landing />)} />
        <Route path={`${this.props.match.path}`} 
          render={(props) => (<Landing />)} />

        <Redirect to='/' />
      </Switch>
    );
  }
}


export default withRouter(App);
