import React from 'react'
import { Link } from 'react-router-dom'
import { truncate } from '../common/helpers'

let bookLink = {};

export default function BookList({ books, toggleFavorite }) {
  return books.map(book => {
    bookLink = { pathname: `/book/${book.bookId}`, state: book };
    return (
      <div key={book.bookId} className="col-lg-3 col-md-6 col-sm-12 mb-3">
        <div className="card">
          <div className="card-header flex-between bg-primary text-light">
            <h5 className="card-title">
              <Link className="text-light" to={bookLink}>{truncate(book.title, 15)}</Link>
            </h5>
            <i id={book.bookId} className={`${(book.isFavorite)? 'fas': 'far'} fa-star`}
              onClick={toggleFavorite} />
          </div>
          <Link to={bookLink}>
            <img src={book.thumb} className="card-img-top" alt={book.title} />
          </Link>
          <div className="card-footer text-center">
            <small className="text-muted d-block">{book.publisher}</small>
            <small className="text-muted d-block">{book.country} | {book.publishedDate} | {book.language}</small>
          </div>
        </div>
      </div>
    )
  })
}