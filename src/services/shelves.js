import {http} from './config'

export default{
    save:(shelf) =>{
        return http.post('shelf', shelf)
    }
}