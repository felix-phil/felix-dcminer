import React, { useEffect } from "react";
import Home from "../Home";
import { connect } from "react-redux";
import { googleAuthentication } from "../../actions/authActions";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

const GoogleOAuth = ({ googleAuthentication }) => {
  let location = useLocation();

  useEffect(() => {
    const values = queryString.parse(location.search);
    const state = values.state ? values.state : null;
    const code = values.code ? values.code : null;
    if (state && code) {
      googleAuthentication(state, code);
    }
  }, [location]);

  return <Home />;
};

export default connect(null, { googleAuthentication })(GoogleOAuth);
