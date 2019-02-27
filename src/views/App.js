import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { PoseGroup } from 'react-pose';
import shortid from 'shortid';
import AnimationContainer from '../common/AnimationContainer';
import Header from './Header'
import './app.css';

const INIT_QUERY = 'birds';

function App({ location, history }) {
  return (
    <>
      <Header location={location} history={history} initQuery={INIT_QUERY} />
      <div className="container">
        <PoseGroup>
          <AnimationContainer key={shortid.generate()}>
            <Switch location={location}>
              <Route path="/books/:query" component={() => <h1>Books query</h1>} />
              <Route path="/book/:id" component={() => <h1>Book details</h1>} />
              <Route path="/favorites" component={() => <h1>favorites Books</h1>} />
              <Redirect to={`/books/${INIT_QUERY}`} />
            </Switch>
          </AnimationContainer>
        </PoseGroup>
      </div>
    </>
  );
}

export default withRouter(App);