import React from "react";
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { Switch, Route } from "react-router-dom";

const App = () => {

  return (
    <div className="App">
      <Alert stack={{limit: 3}} />
      <div className="container mt-3">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
