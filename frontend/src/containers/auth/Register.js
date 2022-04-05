import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register, resendActivation } from "../../actions/authActions";
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
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import { Alert as MuiAlert, AlertTitle } from "@material-ui/lab";
import { useAlert } from "react-alert";
import GoogleButton from "react-google-button";
import { Divider } from "@material-ui/core";
import axios from "axios";
import { google_redirect_uri_2 } from "../../constants";
import Color from "../../constants/Color";
import { useDispatch } from "react-redux";
import { returnErrors } from "../../actions/messages";
import { LOADING, STOP_LOADING } from "../../actions/loadingTypes";
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
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = ({
  register,
  resendActivation,
  isAuthenticated,
  isLoading,
  match,
  message,
  error,
}) => {
  const [messages, setMessages] = useState({
    aMessage: null,
    anError: null,
  });
  const prevProps = useRef({ message, error }).current;
  const alert = useAlert();
  useEffect(() => {
    if (
      match.params.ref !== null &&
      match.params.ref !== undefined &&
      match.params.ref !== ""
    ) {
      sessionStorage.setItem("referrer", match.params.ref);
    }
    // else if (sessionStorage.getItem('referrer')) {
    //     sessionStorage.removeItem('referrer')
    // }
    if (message !== prevProps.message) {
      if (message.regSuccees) {
        // alert.success(message.regSuccees)
        setMessages({
          ...messages,
          aMessage: message.regSuccees,
          anError: null,
        });
      }
    }
  }, [message]);
  const classes = useStyles();
  const [valuess, setValues] = React.useState({
    showPassword: false,
  });
  const dispatch = useDispatch();
  const [valuess2, setValues2] = React.useState({
    showPassword: false,
  });
  const [accountCreated, setAccountCreated] = useState(false);
  const handleClickShowPassword = () => {
    setValues({ ...valuess, showPassword: !valuess.showPassword });
  };
  const handleClickShowPassword2 = () => {
    setValues2({ ...valuess2, showPassword: !valuess2.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    document.title = "DC Miner | Register";
  }, []);
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  };

  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!values.first_name) {
      errors.first_name = "First Name is required";
    }
    if (!values.first_name) {
      errors.last_name = "Last Name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid Email";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password too short";
    } else if (!passw.test(values.password)) {
      errors.password =
        "Password but must be between 8 and 15 characters which contains at least one numeric digit, one uppercase letter, one lowercase letter and one special character]";
    }
    if (!values.re_password) {
      errors.re_password = "Confirmation Password is required";
    } else if (values.re_password !== values.password) {
      errors.re_password = "Passwords doesn't match";
    }
    return errors;
  };
  const submitForm = (values) => {
    register(
      values.first_name,
      values.last_name,
      values.email,
      values.password,
      values.re_password
    );
    setAccountCreated(true);
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
    return <Redirect to="/" />;
  }
  if (accountCreated) {
    // return <Redirect to="/auth/login" />
  }
  const { aMessage, anError } = messages;
  return (
    <React.Fragment>
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
              {aMessage !== null ? (
                <React.Fragment>
                  <MuiAlert severity="success" style={{ marginTop: "5%" }}>
                    <AlertTitle>Registeration Successful!</AlertTitle>
                    {aMessage}
                  </MuiAlert>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="body2" className="mt-3">
                      Didn't see any email ?
                    </Typography>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      style={{ backgroundColor: "#2E3B55", color: "white" }}
                      className={classes.submit}
                      onClick={resendActivation}
                    >
                      Resend Activation Email
                    </Button>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment></React.Fragment>
              )}
              <CssBaseline />
              <div className={classes.paper}>
                <Typography component="h1" variant="h4">
                  Sign Up
                </Typography>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Slide duration={1000} right>
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
                    <Grid item xs={12} sm={6}>
                      <Slide left duration={500}>
                        <TextField
                          error={
                            errors.first_name && touched.first_name
                              ? true
                              : false
                          }
                          variant="filled"
                          margin="normal"
                          required
                          fullWidth
                          id="firstname"
                          label="First Name"
                          name="first_name"
                          autoComplete="first_name"
                          autoFocus
                          value={values.first_name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          helperText={
                            errors.first_name &&
                            touched.first_name &&
                            `${errors.first_name}`
                          }
                        />
                      </Slide>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Slide right duration={500}>
                        <TextField
                          error={
                            errors.last_name && touched.last_name ? true : false
                          }
                          variant="filled"
                          margin="normal"
                          required
                          fullWidth
                          id="last_name"
                          label="Last Name"
                          name="last_name"
                          autoComplete="last_name"
                          value={values.last_name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          helperText={
                            errors.last_name &&
                            touched.last_name &&
                            `${errors.last_name}`
                          }
                        />
                      </Slide>
                    </Grid>
                    <Grid item xs={12}>
                      <Slide left duration={700}>
                        <TextField
                          error={errors.email && touched.email ? true : false}
                          variant="filled"
                          margin="normal"
                          autoComplete="new-password"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          value={values.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          helperText={
                            errors.email && touched.email && `${errors.email}`
                          }
                        />
                      </Slide>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Slide duration={900} left>
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
                          type={valuess.showPassword ? "text" : "password"}
                          id="password"
                          value={values.password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          autoComplete="new-password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                  className="mybtn"
                                >
                                  {valuess.showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          helperText={
                            errors.password &&
                            touched.password &&
                            `${errors.password}`
                          }
                        />
                      </Slide>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Slide duration={900} right>
                        <TextField
                          error={
                            errors.re_password && touched.re_password
                              ? true
                              : false
                          }
                          variant="filled"
                          margin="normal"
                          required
                          fullWidth
                          name="re_password"
                          autoComplete="new-password"
                          label="Confirm Password"
                          type={valuess2.showPassword ? "text" : "password"}
                          id="re_password"
                          value={values.re_password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword2}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                  className="mybtn"
                                >
                                  {valuess2.showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          helperText={
                            errors.re_password &&
                            touched.re_password &&
                            `${errors.re_password}`
                          }
                        />
                      </Slide>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    style={{ textAlign: "center" }}
                  >
                    <Grid item xs={12}>
                      By Signing Up you agree to our{" "}
                      <Link to="/terms">Terms</Link> and{" "}
                      <Link to="/policy">Policies</Link>
                    </Grid>
                  </Grid>
                  <Slide duration={900}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      style={{ backgroundColor: "#2E3B55", color: "white" }}
                      className={classes.submit}
                      disabled={!(dirty && isValid) || isLoading}
                    >
                      {isLoading ? "AUTHENTICATING..." : "Sign Up"}
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
                      <Fade xs={12} lg={12} sm={12} md={12}>
                        <Link to="/auth/login" variant="body2">
                          {"Already Have an Account? Sign In"}
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
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  isLoading: state.loadReducer.isLoading,
  message: state.messageReducer,
  error: state.errorReducer,
});
export default connect(mapStateToProps, { register, resendActivation })(
  Register
);
