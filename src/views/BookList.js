import React from 'react'

export default function BookList({ books, setFavorite }) {
  return books.map(book => (
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