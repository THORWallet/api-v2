import axios from 'axios'

export const TcMidgardApi = axios.create({
  baseURL: process.env.PUBLIC_TC_MIDGARD_URL,
  // it did not throw beforehand if the status was e.g. 500
})
