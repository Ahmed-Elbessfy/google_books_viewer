import { useState, useEffect } from 'react'
import axios from 'axios'
import LS from './localStorage'

// get the API request and send it to the server
// and return the fulfilled data OR error
async function request(req) {
  const [ method, url, body = null ] = req;
  try {
    const { data } = await axios[method](url, body);
    if (data.error)
      return data.error;
    if(!data || !data.totalItems)
      return 'Not found!';
    return data;
  } catch(error) {
    return error.message;
  }
}
// managing offline first data fetching
// if the needed data not exists then request it from API
// when it fulfilled then save it on LS with [query_page] as the key
async function getData(req, key, pageCount, timeout, setState, map) {
  // setState to the loading state
  setState({ loading: true, error: '', data: [], isFetching: true });
  // try get data from local storage
  let data = LS.get(`raw_${key}_${pageCount}`);
  // if there is stored data then check its timestamp
  // if the timestamp in the given timeout
  // then get the mapped data OR map the raw_data with givin map function
  if(data && (Date.now() - data.timestamp) < timeout )
    setState({ loading: false, error: '', data: LS.get(`${key}_${pageCount}`) || map(data, `${key}_${pageCount}`), isFetching: false });
  else {
    // if there isn't stored data then request data from API
    data = await request(req);
    // if the typeof data = 'string' then there is an error
    if(typeof data === 'string')
      setState({ loading: false, error: data, data: [], isFetching: false });
    // if the type of any [array - object] then the data was fulfilled
    else {
      // and the timestamp to data
      data.timestamp = Date.now();
      // store it in [raw_[key]] key in local storage
      LS.set(`raw_${key}_${pageCount}`, JSON.stringify(data));
      // add the query keyword to the LS lookup
      addToLookup(`${key}_${pageCount}`);
      // delete the timestamp from data
      delete data.timestamp;
      // setState with the requested raw data
      setState({ loading: false, error: '', data: map(data, `${key}_${pageCount}`), isFetching: false });
    }
  }
}
// truncate any string larger than 100 characters
export const truncate = (text, length) => (text && text.length > length)? text.slice(0,length-3)+'...' : text;
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
// add data fetching feature to any component
export function useFetch({ key, req, timeout = timestamp.month, deps = [], map = v => v }) {
  const [state, setState] = useState({ loading: true, error: '', data: [], isFetching: false });
  useEffect( () => {
    getData(req, key, 1, timeout, setState, map);
  }, deps);
  return state;
}
// the map book
const mapBook = (query) => (book) => ({
  bookId: book.id,
  title: book.volumeInfo.title,
  subtitle: book.volumeInfo.subtitle,
  authors: book.volumeInfo.authors? book.volumeInfo.authors.join(', '): '',
  publisher: book.volumeInfo.publisher,
  publishedDate: book.volumeInfo.publishedDate,
  description: book.volumeInfo.description,
  pageCount: book.volumeInfo.pageCount,
  rating: book.volumeInfo.averageRating,
  language: book.volumeInfo.language,
  thumb: (book.volumeInfo.imageLinks)? book.volumeInfo.imageLinks.smallThumbnail : '',
  thumbnail: (book.volumeInfo.imageLinks)? book.volumeInfo.imageLinks.thumbnail : '',
  previewUrl: book.volumeInfo.previewLink,
  infoUrl: book.volumeInfo.infoLink,
  country: book.accessInfo.country,
  pdfLink: book.accessInfo.pdf.downloadLink,
  webReaderLink: book.accessInfo.webReaderLink,
  buyLink: book.saleInfo.buyLink,
  selfLink: book.selfLink,
  isFavorite: false,
  query: query
})
// map the fetched books [get only the props that UI needs]
export const bookMapper = (data, query) => data.items.map(mapBook(query));
// fill in the lookup LS key with each query page
export const addToLookup = (query) => {
  let lookup = LS.get('lookup');
  if (!lookup)
    LS.set('lookup', [query]);
  else if (!lookup.includes(query))
    LS.set('lookup', [...lookup, query]);
}
// build the API request to google books API endpoint
export const buildRequest = ({ query = '', search = '', start, pageSize }) => {
  if(query)
    return ['get', `https://www.googleapis.com/books/v1/volumes?printType=books&maxResults=${pageSize}&startIndex=${start}&q=${query}`];
  return ['get', `https://www.googleapis.com/books/v1/volumes?maxResults=${pageSize}&startIndex=${start}&${search}`]
}
// add infinite scroll feature to any component
let start = 0, pageCount = 2;
export function useInfiniteScroll({ key, pageSize, timeout = timestamp.month, map = v => v }) {
  // hold the data state
  // isFetching is a boolean flag to user reach the end of the page
  const [state, setState] = useState({ loading: true, error: '', data: [], isFetching: false });
  // scroll handler which setIsFetching to true when user reach the end of the page
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight)
      setState({ loading: true, error: '', data: [], isFetching: true });
  }
  // bind the scroll handler to the scroll event when component mounted
  // and remove the scroll handler before component unmounted
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // when setIsFetching is true then call the cb function
  useEffect(() => {
    if (state.isFetching) {
      start += pageSize;
      getData(buildRequest({ query: key, start, pageSize }), key, pageCount++, timeout, setState, map);
    }
  }, [state.isFetching]);
  // return the isFetching state
  return state;
}
// add form state to any component
export function useForm(form) {
  const [state, setState] = useState(form);
  const changeHandler = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value
    });
  };
  const submitHandler = (cb) => (e) => {
    e.preventDefault();
    cb(state);
  }
  return {
    state,
    changeHandler,
    submitHandler
  }
}