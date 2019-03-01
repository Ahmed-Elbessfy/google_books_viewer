import React from 'react';
import { useFetch, bookMapper } from '../common/helpers';
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
  }, [items] )
  // show the Loading spinner when data pending
  if (loading)
    return <Loading />
  // show the books OR error
  return (
    <main className="row justify-content-between">
      {(error)
        ? <div className="alert alert-danger" role="alert">{error}</div>
        : books.map(book => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div key={book.bookId} className="card">
                <img src={book.thumb} className="card-img-top" alt={book.title} />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
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