import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { PoseGroup } from 'react-pose';
import shortid from 'shortid';
import AnimationContainer from '../common/AnimationContainer';
import './app.css';

function App({ location, history }) {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#!">
          <img src="https://nckenya.com/wp-content/uploads/books.png" alt="books App"/>
            The Books Bank
          </a>
        </nav>
      </header>
      <div className="container">
        <PoseGroup>
          <AnimationContainer key={shortid.generate()}>
            <Switch location={location}>
              <Route path="/home" component={() => <h1>Home</h1>} />
              <Route path="/favorites" component={() => <h1>favorites</h1>} />
              <Redirect to="/home" />
            </Switch>
          </AnimationContainer>
        </PoseGroup>
      </div>
    </>
  );
}

export default withRouter(App);