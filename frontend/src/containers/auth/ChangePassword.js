import React from "react";
import { Formik } from "formik";
import { changePassword } from "../../actions/authActions";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import { Divider } from "@material-ui/core";
import { connect } from "react-redux";
import { Slide } from "react-reveal";

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
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

const ChangePassword = (
  { match, isLoading, changePassword, isAuthenticated, message, error },
  props
) => {
  const classes = useStyles();

  const [valuess, setValues] = React.useState({
    showPassword: false,
  });
  const [valuess2, setValues2] = React.useState({
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...valuess, showPassword: !valuess.showPassword });
  };
  const handleClickShowPassword2 = () => {
    setValues2({ ...valuess2, showPassword: !valuess2.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const initialValues = {
    password: "",
    re_password: "",
    cpassword: "",
  };

  const validate = (values) => {
    let errors = {};
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
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
    if (!values.cpassword) {
      errors.cpassword = "Current Password is required";
    }
    return errors;
  };
  const submitForm = (values) => {
    const current_password = values.cpassword;
    const new_password = values.password;
    const re_new_password = values.re_password;
    changePassword(new_password, re_new_password, current_password);
  };
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
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Slide duration={500} left>
                      <TextField
                        error={
                          errors.cpassword && touched.cpassword ? true : false
                        }
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="cpassword"
                        label="Current Password"
                        type="password"
                        id="cpassword"
                        value={values.cpassword}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={
                          errors.cpassword &&
                          touched.cpassword &&
                          `${errors.cpassword}`
                        }
                      />
                    </Slide>
                    <Divider className="mt-2 mb-2" />
                    <Slide duration={700}>
                      <TextField
                        error={
                          errors.password && touched.password ? true : false
                        }
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type={valuess.showPassword ? "text" : "password"}
                        id="password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                  <Grid item xs={12}>
                    <Slide duration={700} left>
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
                        label="Confirm New Password"
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
                <Slide right duration={900}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: "#2E3B55", color: "white" }}
                    className={classes.submit}
                    disabled={!(dirty && isValid) || isLoading}
                  >
                    {isLoading ? "REQUESTING..." : "CHANGE PASSWORD"}
                  </Button>
                </Slide>
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
export default connect(mapStateToProps, { changePassword })(ChangePassword);
