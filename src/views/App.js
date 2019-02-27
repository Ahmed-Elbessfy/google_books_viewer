import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { PoseGroup } from 'react-pose';
import shortid from 'shortid';
import AnimationContainer from '../common/AnimationContainer';
import Header from './Header';
import Books from './Books';
import Book from './Book';
import Favorites from './Favorites';
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
              <Route path="/books/:query" component={Books} />
              <Route path="/book/:id" component={Book} />
              <Route path="/favorites" component={Favorites} />
              <Redirect to={`/books/${INIT_QUERY}`} />
            </Switch>
          </AnimationContainer>
        </PoseGroup>
      </div>
    </>
  );
}

export default withRouter(App);