import { createMessage, returnErrors } from "./messages";
import {
  GET_WITHDRAWALS_FAIL,
  GET_WITHDRAWALS_SUCCESS,
  PAY_USER_FAIL,
  PAY_USER_SUCCESS,
  APPROVE_WITHDRAWAL_SUCCESS,
  APPROVE_WITHDRAWAL_FAIL,
} from "./withdrawalTypes";

import axios from "axios";
import { LOADING, STOP_LOADING } from "./loadingTypes";

export const fetchWitdrawals = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .get(
          `${process.env.REACT_APP_API_URL}/payment/api/admin-payments`,
          config
        )
        .then((res) => {
          dispatch({
            type: STOP_LOADING,
          });
          dispatch({
            type: GET_WITHDRAWALS_SUCCESS,
            payload: res.data,
          });
        })
        .catch((err) => {
          dispatch({
            type: STOP_LOADING,
          });
          dispatch({
            type: GET_WITHDRAWALS_FAIL,
          });
        });
    } catch (err) {
      dispatch({
        type: STOP_LOADING,
      });
      dispatch({
        type: GET_WITHDRAWALS_FAIL,
      });
    }
  } else {
    dispatch({
      type: GET_WITHDRAWALS_FAIL,
    });
  }
};

export const approvePayment = (withdrawalId, amount_approved) => async (
  dispatch
) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ amount_approved });
    try {
      dispatch({ type: LOADING });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/payment/api/admin-payments/approve/${withdrawalId}/`,
          body,
          config
        )
        .then((res) => {
          dispatch({ type: STOP_LOADING });
          dispatch({
            type: APPROVE_WITHDRAWAL_SUCCESS,
            payload: res.data,
          });
          dispatch(createMessage({ withdrawalApproved: "Saved" }));
        })
        .catch((err) => {
          dispatch({ type: STOP_LOADING });
          dispatch({ type: APPROVE_WITHDRAWAL_FAIL });
          err &&
            err.response &&
            err.response.data &&
            dispatch(returnErrors(err.response.data, err.response.status));
        });
    } catch (err) {
      dispatch({ type: STOP_LOADING });
      dispatch({ type: APPROVE_WITHDRAWAL_FAIL });
    }
  } else {
    dispatch({
      type: APPROVE_WITHDRAWAL_FAIL,
    });
  }
};

export const payUser = (withdrawalId) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access")}`,
        // "Content-Type": "application/json",
      },
    };
    // const body = JSON.stringify({ amount_approved });
    const body = {};
    try {
      dispatch({ type: LOADING });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/payment/api/admin-payments/payAuser/${withdrawalId}/`,
          body,
          config
        )
        .then((res) => {
          dispatch({ type: STOP_LOADING });
          dispatch({
            type: PAY_USER_SUCCESS,
            payload: withdrawalId,
          });
          dispatch(createMessage({ withdrawalApproved: res.data.response }));
        })
        .catch((err) => {
          dispatch({ type: STOP_LOADING });
          err &&
            err.response &&
            err.response.data &&
            dispatch(returnErrors(err.response.data, err.response.status));
          dispatch({ type: PAY_USER_FAIL });
        });
    } catch (err) {
      dispatch({ type: STOP_LOADING });
      dispatch({ type: PAY_USER_FAIL });
    }
  } else {
    dispatch({
      type: PAY_USER_FAIL,
    });
  }
};
