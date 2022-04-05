import { LOADING, STOP_LOADING } from '../actions/loadingTypes'

const initialState = {
    isLoading: false
}

export default function loadReducer(state = initialState, action) {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isLoading: true
            }
        case STOP_LOADING:
            return {
                ...state,
                isLoading: false
            }
        default: return state
    }
}