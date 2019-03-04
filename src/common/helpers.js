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

async function getData(req, key, timeout, setState, map) {
  // setState to the loading state
  setState({
    loading: true,
    error: '',
    data: []
  });
  // try get data from local storage
  let data = LS.get(`raw_${key}`);
  // if there is stored data then check its timestamp
  // if the timestamp in the given timeout
  // then get the mapped data OR map the raw_data with givin map function
  if(data && (Date.now() - data.timestamp) < timeout ) {
    setState({
      loading: false,
      error: '',
      data: LS.get(key) || map(data, key)
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
        data: []
      });
    // if the type of any [array - object] then the data was fulfilled
    else {
      // and the timestamp to data
      data.timestamp = Date.now();
      // store it in [raw_[key]] key in local storage
      LS.set(`raw_${key}`, JSON.stringify(data));
      // add the query keyword to the LS lookup
      addToLookup(key);
      // delete the timestamp from data
      delete data.timestamp;
      // setState with the requested raw data
      setState({
        loading: false,
        error: '',
        data: map(data, key)
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

export function useFetch({ key, req, timeout = timestamp.month, deps = [], map = v => v }) {
  const [state, setState] = useState({
    loading: true,
    error: '',
    data: []
  });
  useEffect( () => {
    getData(req, key, timeout, setState, map);
  }, deps);
  return state;
}

const mapBook = (query) => (book) => ({
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

export const bookMapper = (data, query) => data.items.map(mapBook(query));

export const addToLookup = (query) => {
  let lookup = LS.get('lookup');
  if (!lookup)
    LS.set('lookup', [query]);
  else if (!lookup.includes(query))
    LS.set('lookup', [...lookup, query]);
}