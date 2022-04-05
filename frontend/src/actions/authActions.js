import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAIL,
  LOGOUT,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  LOAD_USER_PERM_SUCCESS,
  LOAD_USER_PERM_FAIL,
  LOAD_USER_IMAGE_SUCCESS,
  LOAD_USER_IMAGE_FAIL,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
  LOAD_USER_PACKAGE_FAIL,
  LOAD_USER_PACKAGE_SUCCESS,
  CHECK_UPGRADE_STATUS_FAIL,
  CHECK_UPGRADE_STATUS_SUCCESS,
} from "./authTypes";
import { LOADING, STOP_LOADING } from "./loadingTypes";
import { createMessage, returnErrors } from "./messages";

import axios from "axios";

export const checkAuthenticated = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const body = JSON.stringify({ token: localStorage.getItem("access") });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify`,
        body,
        config
      );
      if (res.data.code !== "token_not_valid") {
        dispatch({
          type: AUTHENTICATION_SUCCESS,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATION_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATION_FAIL,
    });
  }
};
export const loadUserPerm = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    await axios
      .get(`${process.env.REACT_APP_API_URL}/auth/auth/user/permissons`, config)
      .then((response) => {
        dispatch({
          type: LOAD_USER_PERM_SUCCESS,
          payload: response.data,
        });
        dispatch(
          createMessage({
            loaduserperm: "User permission was successfully authenticated",
          })
        );
      })
      .catch((err) => {
        dispatch({
          type: LOAD_USER_PERM_FAIL,
        });
        err &&
          err.response &&
          err.response.data &&
          dispatch(returnErrors(err.response.data, err.response.status));
      });
  } else {
    dispatch({
      type: LOAD_USER_PERM_FAIL,
    });
  }
};
export const loadUser = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    // try {
    // const res =
    await axios
      .get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config)
      .then((response) => {
        dispatch({
          type: LOAD_USER_SUCCESS,
          payload: response.data,
        });
        dispatch(
          createMessage({ loaduser: "User was successfully authenticated" })
        );
      })
      .catch((err) => {
        dispatch({
          type: LOAD_USER_FAIL,
        });
        err &&
          err.response &&
          err.response.data &&
          dispatch(returnErrors(err.response.data, err.response.status));
      });
    //     dispatch({
    //         type: LOAD_USER_SUCCESS,
    //         payload: res.data
    //     });
    // } catch (err) {
    //     dispatch({
    //         type: LOAD_USER_FAIL
    //     });
    // }
  } else {
    dispatch({
      type: LOAD_USER_FAIL,
    });
  }
};

export const googleAuthentication = (state, code) => async (dispatch) => {
  if (state && code && !localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const details = {
      state: state,
      code: code,
    };
    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    console.log(formBody);
    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?${formBody}`,
          config
        )
        .then((res) => {
          dispatch({
            type: GOOGLE_AUTH_SUCCESS,
            payload: res.data,
          });
          dispatch({
            type: STOP_LOADING,
          });
          dispatch(loadUser());
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: GOOGLE_AUTH_FAIL,
          });
          dispatch({
            type: STOP_LOADING,
          });
          dispatch(returnErrors(err.response.data, err.response.status));
        });
    } catch (err) {
      dispatch({
        type: GOOGLE_AUTH_FAIL,
      });
      dispatch({
        type: STOP_LOADING,
      });
    }
  }
};

export const resendActivation = () => async (dispatch) => {
  if (sessionStorage.getItem("regEmail")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email: sessionStorage.getItem("regEmail") });
    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/auth/users/resend_activation/`,
          body,
          config
        )
        .then((response) => {
          dispatch(
            createMessage({
              reSendSuccess: "Activation email was successfully re-sent",
            })
          );
          dispatch({
            type: STOP_LOADING,
          });
        })
        .catch((err) => {
          err &&
            err.response &&
            err.response.data &&
            dispatch(returnErrors(err.response.data, err.response.status));
          dispatch({
            type: STOP_LOADING,
          });
          console.log(err);
        });
    } catch (err) {
      console.error(err);
      dispatch({
        type: STOP_LOADING,
      });
      dispatch(createMessage({ resendFailed: "Unable to resend activation" }));
    }
  } else {
    console.log("Email not set!");
  }
};
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    dispatch({
      type: LOADING,
    });
    // const res =
    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config)
      .then((res) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
        dispatch(loadUser());
        dispatch(loadUserPerm());
        dispatch(loadUserImage());
        dispatch(loadUserPackage());
        dispatch(checkUpgradeStatus());
        dispatch({
          type: STOP_LOADING,
        });
      })
      .catch((err) => {
        dispatch({
          type: LOGIN_FAIL,
        });
        dispatch({
          type: STOP_LOADING,
        });
        err &&
          err.response &&
          err.response.data &&
          dispatch(returnErrors(err.response.data, err.response.status));
      });
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch({
      type: STOP_LOADING,
    });
    dispatch(createMessage({ loginError: "Unable to log in" }));
  }
};
export const register = (
  first_name,
  last_name,
  email,
  password,
  re_password
) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  var body = "";
  const ref = sessionStorage.getItem("referrer");
  if (ref !== null && ref !== undefined && ref !== "") {
    body = JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      re_password,
      referrer: sessionStorage.getItem("referrer"),
    });
  } else {
    body = JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      re_password,
    });
  }
  try {
    dispatch({
      type: LOADING,
    });
    // const res =
    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config)
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
        dispatch({
          type: STOP_LOADING,
        });
        sessionStorage.setItem("regEmail", email);
        dispatch(
          createMessage({
            regSuccees: `An activation mail has been sent to ${res.data.email}, Please verify your email to continue!`,
          })
        );
      })
      .catch((err) => {
        dispatch({
          type: STOP_LOADING,
        });
        dispatch({
          type: REGISTER_FAIL,
        });
        dispatch(returnErrors(err.response.data, err.response.status));
      });
    // dispatch({
    //     type: REGISTER_SUCCESS,
    //     payload: res.data
    // });
    // dispatch({
    //     type: STOP_LOADING
    // });
  } catch (err) {
    console.log(err);
    dispatch({
      type: REGISTER_FAIL,
    });
    dispatch({
      type: STOP_LOADING,
    });
    dispatch(createMessage({ regFails: "Unable to register you" }));
  }
};

export const verify = (uid, token) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ uid, token });
  try {
    dispatch({
      type: LOADING,
    });
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/auth/users/activation/`,
        body,
        config
      )
      .then((res) => {
        dispatch({
          type: ACTIVATION_SUCCESS,
        });
        dispatch(
          createMessage({ accActSuc: "Account activation was successful" })
        );
        dispatch({
          type: STOP_LOADING,
        });
      })
      .catch((err) => {
        err &&
          err.response &&
          err.response.data &&
          dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: STOP_LOADING,
        });
        console.log(err);
      });
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
    console.error(err);
    dispatch({
      type: STOP_LOADING,
    });
    dispatch(createMessage({ activationFail: "Account activatioin fails" }));
  }
};
export const resetPassword = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email });
  try {
    dispatch({
      type: LOADING,
    });
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/auth/users/reset_password/`,
        body,
        config
      )
      .then((res) => {
        dispatch({
          type: PASSWORD_RESET_SUCCESS,
        });
        dispatch({
          type: STOP_LOADING,
        });
        dispatch(
          createMessage({
            passReqSuc: `A password reset email has been sent to ${email}, please check mail to continue!`,
          })
        );
      })
      .catch((err) => {
        err &&
          err.response &&
          err.response.data &&
          dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: STOP_LOADING,
        });
        console.log(err);
      });
  } catch (err) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
    });
    dispatch({
      type: STOP_LOADING,
    });
    dispatch(createMessage({ passReqFail: "Unable reset password" }));
  }
};

export const resetPasswordConfirm = (
  uid,
  token,
  new_password,
  re_new_password
) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ uid, token, new_password, re_new_password });
  try {
    dispatch({
      type: LOADING,
    });
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`,
        body,
        config
      )
      .then((res) => {
        dispatch({
          type: PASSWORD_RESET_CONFIRM_SUCCESS,
        });
        dispatch(
          createMessage({
            passResSuc: "Your password has been successfully changed!",
          })
        );
        dispatch({
          type: STOP_LOADING,
        });
      })
      .catch((err) => {
        dispatch({
          type: STOP_LOADING,
        });
        err &&
          err.response &&
          err.response.data &&
          dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: STOP_LOADING,
        });
      });
  } catch (err) {
    dispatch({
      type: PASSWORD_RESET_CONFIRM_FAIL,
    });
    dispatch({
      type: STOP_LOADING,
    });
    dispatch(createMessage({ passResFail: "Password Change Fail!" }));
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const changePassword = (
  new_password,
  re_new_password,
  current_password
) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };
    // console.log({ new_password, re_new_password, current_password })
    const body = JSON.stringify({
      new_password: new_password,
      re_new_password: re_new_password,
      current_password: current_password,
    });

    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/auth/users/set_password/`,
          body,
          config
        )
        .then((response) => {
          console.log(response);
          dispatch(
            createMessage({
              passChangedSuc: "Password has been successfully updated!",
            })
          );
          dispatch({
            type: STOP_LOADING,
          });
        })
        .catch((err) => {
          // console.log(err);
          err &&
            err.response &&
            err.response.data &&
            dispatch(returnErrors(err.response.data, err.response.status));
          dispatch({
            type: STOP_LOADING,
          });
        });
    } catch (err) {
      dispatch(createMessage({ passChangedFail: "Password change failed!" }));
      dispatch({
        type: STOP_LOADING,
      });
    }
  } else {
    dispatch(createMessage({ passChangedFail: "Password change failed!" }));
    // dispatch({
    //   type: STOP_LOADING,
    // });
  }
};
export const loadUserImage = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    await axios
      .get(`${process.env.REACT_APP_API_URL}/auth/api/image/`, config)
      .then((response) => {
        dispatch({
          type: LOAD_USER_IMAGE_SUCCESS,
          payload: response.data,
        });
        dispatch(createMessage({ loaduserimage: "Image loaded" }));
        // console.log(response)
      })
      .catch((err) => {
        dispatch({
          type: LOAD_USER_IMAGE_FAIL,
        });
        err &&
          err.response &&
          err.response.data &&
          dispatch(returnErrors(err.response.data, err.response.status));
      });
  } else {
    dispatch({
      type: LOAD_USER_IMAGE_FAIL,
    });
  }
};
export const loadUserPackage = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    await axios
      .get(`${process.env.REACT_APP_API_URL}/auth/api/payment`, config)
      .then((response) => {
        dispatch({
          type: LOAD_USER_PACKAGE_SUCCESS,
          payload: response.data,
        });
        dispatch(createMessage({ loadUserPackage: "User plan loaded" }));
      })
      .catch((err) => {
        dispatch({
          type: LOAD_USER_PACKAGE_FAIL,
        });
        err && dispatch(returnErrors(err.response.data, err.response.status));
      });
  } else {
    dispatch({
      type: LOAD_USER_PACKAGE_FAIL,
    });
  }
};

export const checkUpgradeStatus = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };
    try {
      await axios
        .get(
          `${process.env.REACT_APP_API_URL}/payment/packages/upgrade/`,
          config
        )
        .then((res) => {
          dispatch({
            type: CHECK_UPGRADE_STATUS_SUCCESS,
            payload: res.data,
          });
        })
        .catch((err) => {
          dispatch({
            type: LOAD_USER_PACKAGE_FAIL,
          });
          err &&
            err.response &&
            err.response.data &&
            dispatch(returnErrors(err.response.data, err.response.status));
        });
    } catch (err) {
      dispatch({
        type: LOAD_USER_PACKAGE_FAIL,
      });
    }
  } else {
    dispatch({
      type: LOAD_USER_PACKAGE_FAIL,
    });
  }
};

export const update_user = (first_name, last_name) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ first_name, last_name });
    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/auth/user/update/`,
          body,
          config
        )
        .then((res) => {
          dispatch(createMessage({ updateUserSuc: "Saved!" }));
          dispatch({
            type: STOP_LOADING,
          });
          // dispatch(loadUser());
        })
        .catch((err) => {
          dispatch(createMessage({ updateUserFail: "Fail!" }));
          console.log(err);
          dispatch({
            type: STOP_LOADING,
          });
        });
    } catch (err) {
      dispatch(createMessage({ updateUserFail: "Fail!" }));
      dispatch({
        type: STOP_LOADING,
      });
    }
  } else {
    console.log("Authorization not provided!");
  }
};

export const submit_billing = (
  fullname,
  address1,
  city,
  phone,
  account_number,
  bank
) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      fullname,
      address1,
      city,
      phone,
      account_number,
      bank,
    });
    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/payment/api/billing`,
          body,
          config
        )
        .then((res) => {
          dispatch(createMessage({ updateUserSuc: "Saved!" }));
          dispatch({
            type: STOP_LOADING,
          });
          // dispatch(loadUser());
        })
        .catch((err) => {
          err &&
            err.response &&
            err.response.data &&
            dispatch(returnErrors(err.response.data, err.response.status));
          dispatch(createMessage({ updateUserFail: "Fail!" }));
          console.log(err);
          dispatch({
            type: STOP_LOADING,
          });
        });
    } catch (err) {
      dispatch(createMessage({ updateUserFail: "Fail!" }));
      dispatch({
        type: STOP_LOADING,
      });
    }
  } else {
    console.log("Authorization not provided!");
  }
};

export const makeWithdrawalRequest = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };
    const body = JSON.stringify({});
    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/payment/api/request-withdraw`,
          body,
          config
        )
        .then(() => {
          dispatch({
            type: STOP_LOADING,
          });
          dispatch(
            createMessage({
              withdrawalSuc: "You have successfully placed a withdrawal!",
            })
          );
        })
        .catch((err) => {
          dispatch({
            type: STOP_LOADING,
          });
          err &&
            err.response &&
            err.response.data &&
            dispatch(returnErrors(err.response.data, err.response.status));
        });
    } catch (err) {
      dispatch({
        type: STOP_LOADING,
      });
      dispatch(createMessage({ withdrawError: "Something went wrong!" }));
    }
  }
};
