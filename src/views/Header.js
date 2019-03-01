import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { fromEvent } from 'rxjs'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'

// set the active nav class based on current location
const activeLink = (match) => window.location.href.includes(match)? 'active' : '';

export default function Header({ location, history, initQuery }) {
  // the search input element ref
  const searchInput = React.useRef(null);

  // get the init_query value based on location.pathname
  // to be param OR initQuery OR ''
  const [ _ , path, param] = location.pathname.split('/');
  const init_query = (path == 'books')? param || initQuery : '';
  // get the query and setQuery state and
  const [ query, setQuery ] = React.useState(init_query);

  // setQuery when location pathname changes
  React.useEffect( () => void setQuery(init_query), [location.pathname] );

  // subscribe to the input event of searchInput ref using rxjs
  React.useEffect(
    () => {
      // Create an Observable that will publish input chars
      // map the event to the chars value
      // debounce it 1 second
      // get the distinct value [diff from the last one]
      // subscribe and go to the books with the new query value
      const subscription = fromEvent(searchInput.current, 'input')
        .pipe(
          map(e => e.target.value),
          filter(Boolean),
          debounceTime(1000),
          distinctUntilChanged())
        .subscribe(val => void history.push(`/books/${val}`));
      // finally return the clean up function that remove the subscription
      return () => void subscription.unsubscribe();
    }, []);

  return (
    <header>
      <nav className="row justify-content-center navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand text-light text-center col-lg-3 col-md-5 col-sm-12" to="/">
          <img className="app-logo" src="/images/books.png" alt="books App"/>
          The Books Bank
        </Link>
        <div className="col-lg-5 col-md-6 col-sm-12">
          <input className="form-control form-control-lg w-100"
            type="search"
            placeholder="Find your favorite books here ..."
            aria-label="Search"
            ref={searchInput}
            value={query}
            onChange={ e => setQuery(e.target.value) } />
        </div>
        <ul className="navbar-nav col-lg-4 col-md-12 flex-center">
          <li className={`nav-item ${activeLink('/books')}`}>
            <NavLink className="nav-link" to={`/books/${initQuery}`}>Home</NavLink>
          </li>
          <li className={`nav-item ${activeLink('/favorites')}`}>
            <NavLink className="nav-link" to="/favorites">Favorites</NavLink>
          </li>
          <li className={`nav-item ${activeLink('/advanced-search')}`}>
            <NavLink className="nav-link" to="/advanced-search">Advanced Search</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}