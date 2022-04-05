import { CREATE_MESSAGE } from "../actions/EAMtypes";

const initailSatate = {};
// reducer
export default function messageReducer(state = initailSatate, action) {
    switch (action.type) {
        case CREATE_MESSAGE:
            return (state = action.payload);
        default:
            return state;
    }
}
