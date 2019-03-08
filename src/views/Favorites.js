import React from 'react';
import LS from '../common/localStorage';
import BookList from '../views/BookList';

let lookups = [],
    tempBooks = [],
    book = {};

export default function Favorites({ match }) {
  // hold the mapped books
  const [books , setBooks] = React.useState([]);
  // when component mount get all lookup keys from LS
  // looping through lookups keys [query_pageCount]
  // and fill the books with only books that isFavorite is true
  React.useEffect(() => {
    lookups = LS.get('lookup');
    lookups.forEach(key => void setBooks( [...books, ...LS.get(key).filter(book => book.isFavorite)] ));
  }, []);
  // get this book and remove it from books state
  // and set isFavorite to false and rewrite it to LS
  const removeFavorite = ({ target }) => {
    book = books.find(book => book.bookId === target.id);
    setBooks(books.filter(book => book.bookId !== target.id));
    // get all books from LS which this book belongs
    tempBooks = LS.get(book.query);
    // update the books with this book setting isFavorite to false
    tempBooks = tempBooks.map(item =>
      (item.bookId === book.bookId)
        ? ({ ...book, isFavorite: false })
        : item
    );
    // rewrite the updated books to LS
    LS.set(book.query, tempBooks);
  };
  // if favorite books doesn't exists show not found
  if (!books)
    return (
      <main>
        <div className="alert alert-warning w-100 text-center" role="alert">Favorite Books Not Found ...</div>
      </main>
    )
  // show the favorite books
  return (
    <main className="row justify-content-center">
      <BookList books={books} favoriteHandler={removeFavorite} />
    </main>
  );
}