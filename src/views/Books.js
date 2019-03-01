import React from 'react';
import { useFetch, bookMapper } from '../common/helpers';
import LS from '../common/localStorage';
import Loading from '../common/Loading';

export default function Books({ match }) {
  // get the query param from match route
  const query = match.params.query;
  // build the API request to google books API endpoint
  const req = ['get', `https://www.googleapis.com/books/v1/volumes?printType=books&maxResults=30&q=${query}`];
  // fetch API data
  let { loading, error, data: { items } } = useFetch({ req, key: query });
  // hold the mapped books
  const [books , setBooks] = React.useState([]);
  // when API data comes then map each book with bookMapper
  React.useEffect( () => {
    if(items && items.length)
      setBooks(items.map(bookMapper));
  }, [items] );
  // set the book isFavorite
  const setFavorite = ({ target }) => {
    setBooks(books.map(book =>
      (book.bookId === target.id)
        ? ({...book, isFavorite: !book.isFavorite})
        : book
    ));
  };
  // when books changed get all favorites and save them to LS
  React.useEffect(
    () => void LS.set('favorite_books', { [query]: books.filter(book => book.isFavorite ) } )
  , [books]);
  // show the Loading spinner when data pending
  if (loading)
    return <Loading />
  // show the books OR error
  return (
    <main className="row justify-content-between">
      {(error)
        ? <div className="alert alert-danger" role="alert">{error}</div>
        : books.map(book => (
            <div key={book.bookId} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="card">
                <div className="card-header flex-between bg-primary text-light">
                  <h5 className="card-title">{book.title}</h5>
                  <i id={book.bookId}
                    className={`${(book.isFavorite)? 'fas': 'far'} fa-star`}
                    onClick={setFavorite} />
                </div>
                <img src={book.thumb} className="card-img-top" alt={book.title} />
                <div className="card-body">
                  <p className="card-text">{book.description}</p>
                </div>
                <div className="card-footer">
                  <small className="text-muted">Publisher: {book.publisher} - {book.publishedDate}</small>
                </div>
              </div>
            </div>
          ))
      }
    </main>
  );
}