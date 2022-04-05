import React, { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { resetPassword } from "../../actions/authActions";
import { Formik } from "formik";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";
import { Alert as MuiAlert, AlertTitle } from "@material-ui/lab";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Slide } from "react-reveal";
import Grid from "@material-ui/core/Grid";

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

const ResetPassword = ({
  resetPassword,
  isLoading,
  isAuthenticated,
  message,
  error,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const classes = useStyles();
  const alert = useAlert();
  const prevProps = useRef({ message, error }).current;
  const [messages, setMessages] = useState({
    aMessage: null,
    anError: null,
  });
  useEffect(() => {
    document.title = "DC Miner | Reset Password";
  }, []);
  useEffect(() => {
    if (message !== prevProps.message) {
      if (message.passReqSuc) {
        setMessages({
          ...messages,
          aMessage: message.passReqSuc,
          anError: null,
        });
      }
    }
  }, [message]);

  const initialValues = {
    email: "",
  };
  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid Email";
    }
    return errors;
  };

  const submitForm = (values) => {
    resetPassword(values.email);
    // setRequestSent(true)
    console.log(`%c Submitted`, "color: green; font-size: 1.5rem");
  };
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  if (requestSent) {
    return <Redirect to="/auth/login" />;
  }
  const { aMessage, anError } = messages;

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
            {aMessage !== null ? (
              <React.Fragment>
                <MuiAlert severity="success" style={{ marginTop: "5%" }}>
                  <AlertTitle>Request Sent!</AlertTitle>
                  {aMessage}
                  {/* {alert.success(aMessage)}
                                            {setRequestSent(true)} */}
                </MuiAlert>
                {}
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h4">
                Reset Password
              </Typography>
              <Avatar className={classes.avatar}>
                <LockOpenRoundedIcon />
              </Avatar>

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
                    <Slide duration={900} right>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: "#2E3B55", color: "white" }}
                        className={classes.submit}
                        disabled={!(dirty && isValid) || isAuthenticated}
                      >
                        {isLoading ? "REQUESTING..." : "Request Reset"}
                      </Button>
                    </Slide>
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
  message: state.messageReducer,
  error: state.errorReducer,
});
export default connect(mapStateToProps, { resetPassword })(ResetPassword);
