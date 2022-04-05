import { GET_ERRORS } from "../actions/EAMtypes";

const initailSatate = {
    msg: {},
    status: null
};

export default function errorReducer(state = initailSatate, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status
            };
        default:
            return state;
    }
}
