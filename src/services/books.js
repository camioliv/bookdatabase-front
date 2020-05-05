import { http } from './config'
import { httpIsbn } from './isbndbConfig'

export default {
    list: (query) => {
        if (query) {
            return http.get('books?query=' + query);
        } else {
            return http.get('books');
        }
    },
    listbyId: (id) =>{
        return http.get('book/' + id)
    },
    listLessThanPages: (pages) => {
        return http.get('books/less-than/' + pages);
    },
    notViewdFrequently: () => {
        return http.get('books/notViewdFrequently');
    },    
    recommend:(userId) =>{
        return http.get('books/recommend/' + userId);
    },
    save:(book) => {
        return http.post('book', book);
    },
    delete:(book) => {
        return http.delete('book', book);
    },
    update:(book) => {
        return http.put('book', book);
    },
    listByISBN: (isbn) => {
        return http.get('book/' + isbn)
    },
    extSearchISBN: (isbn) => {
        return httpIsbn.get('book/' + isbn)
    },
    favorites: (userId) => {
        return http.get('/books/user/'+userId+'/rating/5');
    }    
}