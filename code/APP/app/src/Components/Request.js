import axios from 'axios';

const request = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 20000,
  withCredentials: true,
  headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     }
});

export default request
