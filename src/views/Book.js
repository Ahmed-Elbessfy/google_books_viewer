import React from 'react'
import LS from '../common/localStorage'

let books = [];

const toggleFavorite = (book, setBook) => () => {
  // toggle favorite in book state
  setBook({ ...book, isFavorite: !book.isFavorite});
  // get all books from LS which this book belongs
  books = LS.get(book.query);
  // update the books with this toggled favorite book
  books = books.map(item =>
      (item.bookId === book.bookId)
        ? ({...book, isFavorite: !book.isFavorite})
        : item
    );
  // rewrite the updated books to LS
  LS.set(book.query, books);
}

export default function Book({ location }) {
  // hold the mapped books
  const [book , setBook] = React.useState(location.state);
  if(!book)
    return (
      <main>
        <div className="alert alert-warning w-100 text-center" role="alert">Book Not Found ...</div>
      </main>
    )
  return (
    <main>
      <div className="card mb-3">
        <div className="card-header flex-between bg-primary text-light">
          <h3 className="card-title">{book.title}</h3>
          <i id={book.bookId} className={`${(book.isFavorite) ? 'fas' : 'far'} fa-star`}
              onClick={toggleFavorite(book,setBook)} />
        </div>
        <div className="card-body flex-around-top">
          <img className="flex-b-30" src={book.thumb} alt={book.title} />
          <div className="flex-b-60">
            <h4 className="card-subtitle mb-2 text-muted">{book.subtitle}</h4>
            <p className="card-text">Author(s): {book.authors}</p>
            <p className="card-text">{book.description}</p>
            <p className="card-text">Publisher: {book.publisher}</p>
            <p className="card-text">Published Date: {book.publishedDate}</p>
            <p className="card-text">Country: {book.country}</p>
            <p className="card-text">Language: {book.language}</p>
            <p className="card-text">Page Count: {book.pageCount}</p>
          </div>
        </div>
        <div className="card-footer text-center">
          <a target="_blank" href={book.infoUrl} className="card-link">More Info Link</a>
          <a target="_blank" href={book.previewUrl} className="card-link">Preview Link</a>
          <a target="_blank" href={book.webReaderLink} className="card-link">Web Reader Link</a>
          { book.pdfLink && <a target="_blank" href={book.pdfLink} className="card-link">PDF Link</a>}
          { book.buyLink && <a target="_blank" href={book.buyLink} className="card-link">Buy Link</a>}
        </div>
      </div>
    </main>
  );
}