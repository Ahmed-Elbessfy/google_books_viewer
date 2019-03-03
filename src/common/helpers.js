import { useState, useEffect } from 'react'
import axios from 'axios'
import LS from './localStorage'

async function request(req) {
  const [ method, url, body = null ] = req;
  try {
    const { data } = await axios[method](url, body);
    if (data.error)
      return data.error;
    if(!data)
      return 'Not found!';
    return data;
  } catch(error) {
    return error.message;
  }
}

async function getData(req, key, timeout, setState) {
  // setState to the loading state
  setState({
    loading: true,
    error: '',
    data: {}
  });
  // try get data from local storage
  let data = LS.get(`raw_${key}`);
  // if there is stored data then check its timestamp
  // if its timestamp in the given timeout
  // then get the mapped data OR the raw_data
  if(data && (Date.now() - data.timestamp) < timeout ) {
    setState({
      loading: false,
      error: '',
      data: LS.get(key) || data
    });
  }
  else {
    // if there isn't stored data then request data from API
    data = await request(req);
    // if the typeof data = 'string' then there is an error
    if(typeof data === 'string')
      setState({
        loading: false,
        error: data,
        data: {}
      });
    // if the type of any [array - object] then the data was fulfilled
    else {
      // and the timestamp to data
      data.timestamp = Date.now();
      // store it in [raw_[key]] key in local storage
      LS.set(`raw_${key}`, JSON.stringify(data));
      // delete the timestamp from data
      delete data.timestamp;
      // setState with the requested raw data
      setState({
        loading: false,
        error: '',
        data: data
      });
    }
  }
}

export const truncate = (text) => (text && text.length > 100)? text.slice(0,98)+'...' : text;

// timestamp units by milliseconds
export const timestamp = {
  year: 31536000000,  // 365 days
  month: 2592000000,  // 30 days
  week: 604800000,    // 7 days
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000
};

export function useFetch({ key, req, timeout = timestamp.month, deps = [] }) {
  const [state, setState] = useState({
    loading: true,
    error: '',
    data: {}
  });
  useEffect( () => {
    getData(req, key, timeout, setState);
  }, deps);
  return state;
}

export const bookMapper = (query) => (book) => ({
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
  thumb: (book.volumeInfo.imageLinks)? book.volumeInfo.imageLinks.smallThumbnail : '',
  thumbnail: (book.volumeInfo.imageLinks)? book.volumeInfo.imageLinks.thumbnail : '',
  previewUrl: book.volumeInfo.previewLink,
  infoUrl: book.volumeInfo.infoLink,
  isFavorite: false,
  query: query
})

export const addToLookup = (query) => {
  let lookup = LS.get('lookup');
  if (!lookup)
    LS.set('lookup', [query]);
  else if (!lookup.includes(query))
    LS.set('lookup', [...lookup, query]);
}