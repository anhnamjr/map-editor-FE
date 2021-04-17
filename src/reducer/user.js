import { SET_USER } from '../constants/actions';

const initState = {
    user: {}
}

export const treeReducer = (state=initState, action) => {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }

        default: return {...state}
    }
}