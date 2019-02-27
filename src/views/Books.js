import React from 'react';
import { useFetch } from '../common/helpers';
import Loading from '../common/Loading';

const truncate = (text) => (text && text.length > 100)? text.slice(0,98)+'...' : text;

export default function Books({ match }) {
  const query = match.params.query;
  const req = ['get', `https://www.googleapis.com/books/v1/volumes?printType=books&maxResults=30&q=${query}`];
  let { loading, error, data: { items } } = useFetch({ req, key: query });

  const [books , setBooks] = React.useState([]);
  React.useEffect( () => {
    if(items && items.length) {
      setBooks(items.map( book => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        subtitle: book.volumeInfo.subtitle,
        authors: book.volumeInfo.authors,
        publisher: book.volumeInfo.publisher,
        publishedDate: book.volumeInfo.publishedDate,
        description: truncate(book.volumeInfo.description),
        pageCount: book.volumeInfo.pageCount,
        rating: book.volumeInfo.averageRating,
        language: book.volumeInfo.language,
        thumb: book.volumeInfo.imageLinks.smallThumbnail,
        thumbnail: book.volumeInfo.imageLinks.thumbnail,
        previewUrl: book.volumeInfo.previewLink,
        infoUrl: book.volumeInfo.infoLink
      }) ))
    }
  }, [items] )

  if (loading)
    return <Loading />

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