import React from 'react'
import { buildRequest, useFetch, bookMapper } from '../common/helpers';
import Loading from '../common/Loading';
import BookList from '../views/BookList';

export default function SearchResult({ match }) {
  // get the query param from match route
  const search = match.params.search;
  // fetch API data
  let { loading, error, data } = useFetch({ req: buildRequest({ search, start: 0, pageSize: 40 }), key: search, map: bookMapper });
  // show the Loading spinner when data pending
  if (loading)
    return <Loading />
  return (
    <main className="row justify-content-center">
      {(error)
        ? <div className="alert alert-danger w-100 text-center" role="alert">{error}</div>
        : <BookList books={data} favoriteHandler={null} />
      }
    </main>
  )
}
