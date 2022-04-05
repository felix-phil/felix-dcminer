import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useLocation, useHistory } from "react-router";
import Loading from "../Loading";
import { useAlert } from "react-alert";

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  perm,
  isLoading,
  ...rest
}) => {
  const location = useLocation();
  const history = useHistory();
  const alert = useAlert();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated === true) {
          // return <Redirect to="/auth/login" />;
          if (perm && perm.is_staff && perm.is_superuser) {
            return (
              <div>
                <Component {...props} />
              </div>
            );
          } else {
            alert.error("Access Denied!");
            // return <div>Access Denied!</div>;
            history.push("/");
          }
        } else if (isAuthenticated === null) {
          return <Loading />;
        } else {
          return (
            <Redirect to={`/auth/login?redirectTo=${location.pathname}`} />
          );
        }
      }}
    />
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  perm: state.authReducer.permissions,
  isLoading: state.loadReducer.isLoading,
});

export default connect(mapStateToProps)(PrivateRoute);
