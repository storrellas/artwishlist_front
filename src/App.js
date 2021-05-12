import React from 'react';

import { Redirect, Switch, Route } from "react-router-dom";
import { withRouter } from 'react-router-dom'

import Landing from './pages/Landing'
import Detail from './pages/Detail'

import './App.css';

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
        <Route path={`${this.props.match.path}`} exact
          render={(props) => (<Landing />)} />
        <Route path={`${this.props.match.path}detail/`}
          render={(props) => (<Detail />)} />
        <Redirect to='/' />
      </Switch>
    );
  }
}


export default withRouter(App);
