import React from 'react';
import LS from '../common/localStorage';
import { useFetch, bookMapper } from '../common/helpers';
import Loading from '../common/Loading';
import BookList from '../views/BookList';

export default function Books({ match }) {
  // get the query param from match route
  const query = match.params.query;
  // build the API request to google books API endpoint
  const req = ['get', `https://www.googleapis.com/books/v1/volumes?printType=books&maxResults=30&q=${query}`];
  // fetch API data
  let { loading, error, data } = useFetch({ req, key: query, map: bookMapper });
  // hold the mapped books
  const [books , setBooks] = React.useState([]);
  // when API data fulfilled then set books state
  React.useEffect( () => setBooks(data), [data.length] );
  // when books changed [setFavorite] save changes to LS
  React.useEffect(() => void LS.set(query, books), [books]);
  // set the book isFavorite and change books state
  const setFavorite = ({ target }) => {
    setBooks(books.map(book =>
      (book.bookId === target.id)
        ? ({...book, isFavorite: !book.isFavorite})
        : book
    ));
  };
  // show the Loading spinner when data pending
  if (loading)
    return <Loading />
  // show the books OR error
  return (
    <main className="row justify-content-between">
      {(error)
        ? <div className="alert alert-danger" role="alert">{error}</div>
        : <BookList books={books} setFavorite={setFavorite} />
      }
    </main>
  );
}