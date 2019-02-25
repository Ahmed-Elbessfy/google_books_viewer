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
  setState({
    loading: true,
    error: '',
    data: {}
  });
  let data = LS.get(key);
  if(data && (Date.now() - data.timestamp) < timeout ) {
    delete data.timestamp;
    setState({
      loading: false,
      error: '',
      data: data
    });
  }
  else {
    data = await request(req);
    if(typeof data === 'string')
      setState({
        loading: false,
        error: data,
        data: {}
      });
    else {
      data.timestamp = Date.now();
      LS.set(key, JSON.stringify(data));
      delete data.timestamp;
      setState({
        loading: false,
        error: '',
        data: data
      });
    }
  }
}

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