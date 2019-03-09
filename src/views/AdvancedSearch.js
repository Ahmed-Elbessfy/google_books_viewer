import React from 'react'
import { useForm } from '../common/helpers'

let searchParams = '';

export default function AdvancedSearch() {
  const { state, changeHandler, submitHandler } = useForm({
    'title': '',
    'author': '',
    'publisher': '',
    'subject': '',
    'isbn': '',
    'downloadFormat': '',
    'filter': '',
    'printType': ''
  });

  const search = (values) => {
    console.log(values);
    const { title, author, publisher, subject, isbn, downloadFormat, filter, printType } = values;
    if(title)
      searchParams += `?q=intitle:${values.title}`;
    if(author)
      searchParams += `+inauthor:${author}`;
    if(publisher)
      searchParams += `+inpublisher:${publisher}`;
    if(subject)
      searchParams += `+subject:${subject}`;
    if(isbn)
      searchParams += `+isbn:${isbn}`;
    if(downloadFormat)
      searchParams += `&download=${downloadFormat}`;
    if(filter)
      searchParams += `&filter=${filter}`;
    if(printType)
      searchParams += `&printType=${printType}`;
    console.log(searchParams);
  }

  return (
    <main>
      <h3>Advanced Search</h3>
      <hr/>
      <form className="row" onSubmit={submitHandler(search)}>
        <div className="col-lg-6 col-md-12">
          <input type="text" className="form-control mb-2" placeholder="Title"     name="title"     value={state.title}     onChange={changeHandler} />
          <input type="text" className="form-control mb-2" placeholder="Author"    name="author"    value={state.author}    onChange={changeHandler} />
          <input type="text" className="form-control mb-2" placeholder="Publisher" name="publisher" value={state.publisher} onChange={changeHandler} />
          <input type="text" className="form-control mb-2" placeholder="Subject"   name="subject"   value={state.subject}   onChange={changeHandler} />
          <input type="text" className="form-control mb-2" placeholder="ISBN"      name="isbn"      value={state.isbn}      onChange={changeHandler} />
        </div>
        <div className="col-lg-6 col-md-12">
          {/* Download Format */}
          <div className="mb-2">
            <div>Download Format:</div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="epub" type="checkbox" name="downloadFormat"
                value="epub" checked={state.downloadFormat === "epub"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="epub">epub</label>
            </div>
          </div>
          {/* Payment and Preview Ability  [filter] */}
          <div className="mb-2">
            <div>Payment And Preview Ability:</div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="full-preview" type="radio" name="filter"
                value="full" checked={state.filter === "full"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="full-preview">full-preview</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="partial-preview" type="radio" name="filter"
                value="partial" checked={state.filter === "partial"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="partial-preview">partial-preview</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="free-ebooks" type="radio" name="filter"
                value="free-ebooks" checked={state.filter === "free-ebooks"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="free-ebooks">free-ebooks</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="paid-ebooks" type="radio" name="filter"
                value="paid-ebooks" checked={state.filter === "paid-ebooks"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="paid-ebooks">paid-ebooks</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="ebooks" type="radio" name="filter"
                value="ebooks" checked={state.filter === "ebooks"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="ebooks">ebooks (free+paid+full-preview)</label>
            </div>
          </div>
          {/* Print Type */}
          <div className="mb-2">
            <div>Print Type:</div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="all" type="radio" name="printType"
                value="all" checked={state.printType === "all"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="all">all</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="books" type="radio" name="printType"
                value="books" checked={state.printType === "books"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="books">books</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" id="magazines" type="radio" name="printType"
                value="magazines" checked={state.printType === "magazines"} onChange={changeHandler} />
              <label className="form-check-label" htmlFor="magazines">magazines</label>
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-lg w-25 mx-auto">Search</button>
      </form>
    </main>
  );
}