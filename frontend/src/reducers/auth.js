import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_SUCCESS,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAIL,
  LOGOUT,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_LOADING,
  AUTH_COMPLETE,
  LOAD_USER_PERM_SUCCESS,
  LOAD_USER_PERM_FAIL,
  LOAD_USER_IMAGE_SUCCESS,
  LOAD_USER_IMAGE_FAIL,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
  LOAD_USER_PACKAGE_SUCCESS,
  LOAD_USER_PACKAGE_FAIL,
  CHECK_UPGRADE_STATUS_SUCCESS,
  CHECK_UPGRADE_STATUS_FAIL,
} from "../actions/authTypes";

const initialState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: null,
  user: null,
  userImage: null,
  permissions: null,
  isLoading: false,
  package: null,
  upgradeAble: false,
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case AUTH_COMPLETE:
      return {
        ...state,
        isLoading: false,
      };
    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("access", payload.access);
      localStorage.setItem("refresh", payload.refresh);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
        user: payload.email,
        permissions: payload.is_staff,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case LOAD_USER_PERM_SUCCESS:
      return {
        ...state,
        permissions: payload,
      };
    case LOAD_USER_PACKAGE_SUCCESS:
      return {
        ...state,
        package: payload,
      };
    case LOAD_USER_IMAGE_SUCCESS:
      return {
        ...state,
        userImage: payload,
      };
    case CHECK_UPGRADE_STATUS_SUCCESS:
      return {
        ...state,
        upgradeAble: payload.length > 0 ? true : false,
      };
    case CHECK_UPGRADE_STATUS_FAIL:
      return {
        ...state,
        upgradeAble: false,
      };
    case LOAD_USER_IMAGE_FAIL:
      return {
        ...state,
        userImage: null,
      };
    case LOAD_USER_PACKAGE_FAIL:
      return {
        ...state,
        package: null,
      };
    case AUTHENTICATION_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        user: null,
        permissions: null,
      };
    case GOOGLE_AUTH_SUCCESS:
      localStorage.setItem("access", payload.access);
      localStorage.setItem("refresh", payload.refresh);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
      };
    case GOOGLE_AUTH_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
    case REGISTER_FAIL:
    case LOAD_USER_PERM_FAIL:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return {
        ...state,
        isAuthenticated: false,
        access: null,
        refresh: null,
        user: null,
        permissions: null,
        userImage: null,
      };

    case PASSWORD_RESET_SUCCESS:
    case PASSWORD_RESET_FAIL:
    case PASSWORD_RESET_CONFIRM_FAIL:
    case PASSWORD_RESET_CONFIRM_SUCCESS:
    case ACTIVATION_SUCCESS:
    case ACTIVATION_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}
