import axios from 'axios'


export const $api= axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': '*',
      }
})
  