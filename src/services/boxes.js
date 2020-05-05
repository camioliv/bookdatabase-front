import {http} from './config'

export default{
    save:(box) =>{
        return http.post('box', box)
    }
}