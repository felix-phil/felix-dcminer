const localhost = process.env.REACT_APP_API_URL;

const apiURL = "/article/api";

export const endpointArticle = `${localhost}${apiURL}`;
export const articleListURL = `${endpointArticle}/article/user/`;
export const catListURL = `${endpointArticle}/cat/user/`;
export const subcatListURL = `${endpointArticle}/subcat/user/`;
export const catDetailURL = (id) => `${endpointArticle}/article/cat/${id}/`;
export const subcatDetailURL = (id) =>
  `${endpointArticle}/article/subcat/${id}/`;
export const articleDetail = (id) => `${endpointArticle}/article/user/${id}`;
export const articleComment = (id) =>
  `${endpointArticle}/article/comments/${id}/`;
export const submitNewComment = `${endpointArticle}/comment/`;
export const deleteCommentURL = (cId) => `${endpointArticle}/comment/${cId}/`;
export const editCommentURL = (cId) => `${endpointArticle}/comment/${cId}/`;
export const aboutList = `${localhost}/other/api/about/`;
export const contactURL = `${localhost}/other/api/contact/`;
export const policyURL = `${localhost}/other/api/policy/`;
export const termsURL = `${localhost}/other/api/terms/`;
export const searchURL = (searchText, orderingBy) =>
  `${endpointArticle}/article/search/?search=${searchText}&ordering=${orderingBy}`;
export const profilepicURL = (id) => `${localhost}/auth/api/profilepic/${id}/`;
export const extraURL = `${localhost}/auth/auth/user/extras`;
export const google_redirect_uri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
export const google_redirect_uri_2 = process.env.REACT_APP_GOOGLE_REDIRECT_URI2;
export const packageURL = `${localhost}/payment/packages`;
export const planDetail = (planname) =>
  `${localhost}/payment/packages/plan/?planname=${planname}`;
export const paramsURL = (tier) =>
  `${localhost}/djangoflutterwave/payment-params/?plan=${tier}`;
export const upgradeParamsURL = (tier) =>
  `${localhost}/payment/djangoflutterwave/upgrade/?planname=${tier}`;
export const paymentURL = `${localhost}/payment/api/payment/`;
export const paymentUpgradeURL = `${localhost}/payment/api/payment/upgrade/`;
export const upgradeURL = `${localhost}/payment/packages/upgrade/`;
// export const checkUpradeURL = `${localhost}/payment/packages/upgrade/`;
export const adminUrl = `${localhost}/admin/`;
export const updateUser = `${localhost}/auth/user/update/`;
export const verifyBankAccountURL = `${localhost}/payment/banks`;
export const bankListUrl = `${localhost}/payment/banks`;
export var FLW_SECRET;
if (process.env.REACT_APP_DEBUG === "true") {
  FLW_SECRET = process.env.REACT_APP_FLW_SECRET_SANDBOX;
} else {
  FLW_SECRET = process.env.REACT_APP_FLW_SECRET_PRODUCTION;
}
