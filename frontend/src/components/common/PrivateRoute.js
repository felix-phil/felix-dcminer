import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../Loading";

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  perm,
  isLoading,
  ...rest
}) => {
  const location = useLocation();
  const history = useHistory();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated === true) {
          return (
            <div>
              <Component {...props} />
            </div>
          );
        } else if (isAuthenticated === null) {
          return <Loading />;
        } else {
          return (
            <Redirect to={`/auth/login?redirectTo=${location.pathname}`} />
          );
          // history.push(`/auth/login?redirectTo=${location.pathname}`);
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
