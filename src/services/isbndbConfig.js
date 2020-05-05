import axios from 'axios'

export const httpIsbn = axios.create({
    baseURL: 'https://api2.isbndb.com/',
    headers: {
        'Authorization': '43969_1aee6e8b5029c7fe83aeab4d5e12e836'
      }
})