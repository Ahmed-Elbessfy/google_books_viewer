import React from 'react';
import LS from '../common/localStorage';
import { buildRequest, useFetch, bookMapper, useInfiniteScroll } from '../common/helpers';
import Loading from '../common/Loading';
import BookList from '../views/BookList';

const PAGE_SIZE = 30;

export default function Books({ match }) {
  // get the query param from match route
  const query = match.params.query;
  // fetch API data
  let { loading, error, data } = useFetch({ req: buildRequest(query, 0, PAGE_SIZE), key: query, map: bookMapper });
  // get the paging data
  let { isFetching, data: pagingData } = useInfiniteScroll({ key: query, pageSize: PAGE_SIZE, map: bookMapper });
  // hold the mapped books
  const [books , setBooks] = React.useState([]);
  // when API data fulfilled then set books state
  React.useEffect( () => setBooks(data), [data.length] );
  React.useEffect( () => setBooks([...books, ...pagingData]), [pagingData.length] );
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
        ? <div className="alert alert-danger w-100 text-center" role="alert">{error}</div>
        : <BookList books={books} setFavorite={setFavorite} />
      }
      {(isFetching)
        ? <div className="alert alert-warning w-100 text-center" role="alert">Fetching more list items...</div>
        : null
      }
    </main>
  );
}