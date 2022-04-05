import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/authActions";
import { Formik } from "formik";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Color from "../../constants/Color";
// import Fab from '@material-ui/core/Fab';
import { google_redirect_uri, google_redirect_uri_2 } from "../../constants";
import GoogleButton from "react-google-button";
import { Divider } from "@material-ui/core";
import axios from "axios";
import { useDispatch } from "react-redux";
import { returnErrors } from "../../actions/messages";
import { LOADING, STOP_LOADING } from "../../actions/loadingTypes";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router";
import { Slide, Fade } from "react-reveal";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#2E3B55",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = ({ login, isAuthenticated, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    document.title = "DC Miner | Login";
  }, []);
  const { redirectTo } = queryString.parse(location.search);
  const initialValues = {
    email: "",
    password: "",
  };
  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid Email";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password too short";
    }
    return errors;
  };

  const submitForm = (values) => {
    login(values.email, values.password);
    console.log(`%c Submitted`, "color: green; font-size: 1.5rem");
  };
  const continueWithGoogle = async () => {
    try {
      dispatch({
        type: LOADING,
      });
      await axios
        .get(
          `${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${google_redirect_uri_2}`
        )
        .then((res) => {
          dispatch({
            type: STOP_LOADING,
          });
          window.location.replace(res.data.authorization_url);
        })
        .catch((err) => {
          dispatch(returnErrors(err.response.data, err.response.status));
          dispatch({
            type: STOP_LOADING,
          });
        });
    } catch (err) {
      dispatch({
        type: STOP_LOADING,
      });
    }
  };
  if (isAuthenticated) {
    // history.push(redirectTo == null ? '/' : redirectTo)
    return <Redirect to={redirectTo == null ? "/" : redirectTo} />;
  }
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={submitForm}
    >
      {(formik) => {
        const {
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          handleBlur,
          isValid,
          dirty,
        } = formik;

        return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />

            <div className={classes.paper}>
              <Typography component="h1" variant="h4">
                Sign In
              </Typography>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Slide right duration={1000}>
                <GoogleButton
                  onClick={continueWithGoogle}
                  className="mybtn mt-3"
                  width="100%"
                  type="dark"
                  style={{ backgroundColor: Color.dcminer }}
                />
              </Slide>
              <br />
              <Divider color="secondary" />

              <Typography>OR</Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Slide duration={500} left>
                      <TextField
                        error={errors.email && touched.email ? true : false}
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={
                          errors.email && touched.email && `${errors.email}`
                        }
                      />
                    </Slide>
                  </Grid>
                  <Grid item xs={12}>
                    <Slide duration={700} left>
                      <TextField
                        error={
                          errors.password && touched.password ? true : false
                        }
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={
                          errors.password &&
                          touched.password &&
                          `${errors.password}`
                        }
                      />
                    </Slide>
                  </Grid>
                </Grid>
                <Slide duration={900} right>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: "#2E3B55", color: "white" }}
                    className={classes.submit}
                    disabled={!(dirty && isValid) || isLoading}
                  >
                    {isLoading ? "AUTHENTICATING..." : "Sign In"}
                  </Button>
                </Slide>
                <Grid container>
                  <Grid item xs={12} lg={12} sm={12} md={12}>
                    <Fade duration={1000}>
                      <Link to="/auth/password/reset" variant="body2">
                        Forgot password?
                      </Link>
                    </Fade>
                  </Grid>
                  <Grid item xs={12} lg={12} sm={12} md={12}>
                    <Fade duration={1000}>
                      <Link to="/auth/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Fade>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  isLoading: state.loadReducer.isLoading,
});

export default connect(mapStateToProps, { login })(Login);
