import React from 'react';
import LS from '../common/localStorage';
import { buildRequest, useFetch, bookMapper, useInfiniteScroll } from '../common/helpers';
import Loading from '../common/Loading';
import BookList from '../views/BookList';

const pageSize = 12;
let lookups = [], tempBooks = [];

export default function Books({ match }) {
  // get the query param from match route
  const query = match.params.query;
  // fetch API data
  let { loading, error, data } = useFetch({ req: buildRequest({ query, start: 0, pageSize }), key: query, map: bookMapper });
  // get the paging data
  let { isFetching, data: pagingData } = useInfiniteScroll({ key: query, pageSize, map: bookMapper });
  // hold the mapped books
  const [books , setBooks] = React.useState([]);
  // hold the page counter
  const [pageCount , setPageCount] = React.useState(0);
  // when API data either from [initial data] OR [pagingData] are fulfilled
  // then set books state and increment pageCount
  React.useEffect( () => {
    if (data.length) {
      setBooks(data);
      setPageCount(pageCount+1);
    }
  }, [data.length] );
  React.useEffect( () => {
    if (pagingData.length) {
      setBooks([...books, ...pagingData]);
      setPageCount(pageCount+1);
    }
  }, [pagingData.length] );
  // when books changed [favorite toggled] save changes to LS
  // by looping through lookups keys [query_pageCount]
  // and set the books that belongs to [query_pageCount]
  // only if books exists in the books state
  React.useEffect(() => {
    if (books.length) {
      lookups = LS.get('lookup');
      lookups.forEach(key => {
        tempBooks = books.filter(book => book.query === key);
        if(tempBooks.length)
          LS.set(key, tempBooks);
      });
    }
  }, [books]);
  // toggle the book isFavorite and change books state
  const toggleFavorite = ({ target }) => {
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
    <>
      <main className="row justify-content-between">
        {(error)
          ? <div className="alert alert-danger w-100 text-center" role="alert">{error}</div>
          : <BookList books={books} favoriteHandler={toggleFavorite} />
        }
      </main>
      { isFetching && <Loading /> }
    </>
  );
}