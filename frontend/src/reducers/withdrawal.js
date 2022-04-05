import {
  GET_WITHDRAWALS_FAIL,
  GET_WITHDRAWALS_SUCCESS,
  PAY_USER_FAIL,
  PAY_USER_SUCCESS,
  APPROVE_WITHDRAWAL_SUCCESS,
  APPROVE_WITHDRAWAL_FAIL,
} from "../actions/withdrawalTypes";

const initialState = {
  withdrawals: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        withdrawals: payload,
      };
    case GET_WITHDRAWALS_FAIL:
      return {
        ...state,
        withdrawals: [],
      };
    case PAY_USER_SUCCESS:
      const userWithdrawal = state.withdrawals.find(
        (withdr) => withdr.id === payload
      );
      const updatedWWithdrawl = state.withdrawals.filter((withdr) =>
        withdr.id === userWithdrawal.id ? false : true
      );
      return {
        ...state,
        withdrawals: updatedWWithdrawl,
      };
    case PAY_USER_FAIL:
      return state;
    case APPROVE_WITHDRAWAL_SUCCESS:
      const removePreviousValue = state.withdrawals.filter((withdr) =>
        withdr.id === payload.id ? false : true
      );
      const updatedWithdrawl = [...removePreviousValue, { ...payload }];
      return {
        ...state,
        withdrawals: updatedWithdrawl,
      };
    case APPROVE_WITHDRAWAL_FAIL:
    case PAY_USER_FAIL:
      return state;
    default:
      return state;
  }
};
