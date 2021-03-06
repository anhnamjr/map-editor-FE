import axios from 'axios'
import { FETCH_LAYER_DATA } from '../constants/actions'
import { BASE_URL } from '../constants/endpoint'

export const fetchLayerData = (layerId) => {
    // TODO
    const result = axios.get(`${BASE_URL}/data`, {
        layerId
    }).then(res => res.data.maps)
    
    console.log(result)

    return {
        type: FETCH_LAYER_DATA,
        payload: result
    }
}