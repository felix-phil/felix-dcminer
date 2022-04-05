import React, { useState, useCallback, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ImageBack from "../../assets/images/contact us.jpeg";
import { contactURL } from "../../constants";
import axios from "axios";
import { Formik } from "formik";
import TextField from "@material-ui/core/TextField";
import ContactMailRoundedIcon from "@material-ui/icons/ContactMailRounded";
import Chip from "@material-ui/core/Chip";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import MuiLink from "@material-ui/core/Link";
import { Alert as MuiAlert, AlertTitle } from "@material-ui/lab";
import OtherTop from "../../components/common/OtherTop";
import { Slide, Bounce } from "react-reveal";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  avatar: {
    backgroundColor: " #121721",
    width: "10vh",
    height: "10vh",
  },
  avatar2: {
    backgroundColor: " #ffffff",
    width: "10vh",
    height: "10vh",
  },
  avatarIcon: {
    width: "5vh",
    height: "5vh",
  },
  heroContent: {
    backgroundColor: "#e6e6e6",
    // padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  subCardGrid: {
    height: "80vh",
    // width: "85%",
    position: "relative",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardHover: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      backgroundColor: "#2E3B55",
      color: "#ffffff",
      cursor: "pointer",
    },
  },
  cardHover2: {
    "&:hover": {
      backgroundColor: "#eef1f6",
      color: "#ffffff",
    },
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardMed: {
    paddingTop: "40%",
    backgroundColor: "#2E3B55",
    zIndex: theme.zIndex.card + 1,
  },
  cardContent: {
    flexGrow: 1,
  },
  topCon: {
    position: "absolute",
    zIndex: theme.zIndex.cardContent + 1,
    color: "white",
    // top: 'auto',
    // bottom: 'auto',
    left: "50%",
    width: "100%",
    height: "100%",
    paddingRight: "50%",
    paddingLeft: "50%",
    // paddingTop: '50%',
    paddingBottom: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#2E3B55",
    opacity: 0.3,
    fontSize: "10vh",
  },

  cardDetails: {
    flex: 1,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chip: {
    flex: 2,
  },
  iconGroup: {
    display: "flex",
    flexDirection: "row",
    justify: "space-around",
    width: "80%",
    alignItems: "center",
  },
}));

const Contact = () => {
  const classes = useStyles();
  const [contact, setContact] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  };
  const handleClick = (e) => {
    let params = `srollbars=no, resizeable=no, status=no,location=no, toolbar=no, menubar=no, width=0, height=0, left=-1000, top=-1000`;
    window.open(e, "link", params);
  };
  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!values.firstname) {
      errors.firstname = "First Name is required";
    }
    if (!values.lastname) {
      errors.lastname = "Last Name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid Email";
    }
    if (!values.message) {
      errors.message = "Please add your message";
    }
    return errors;
  };

  const submitForm = (values) => {
    // console.log(values)
    // console.log(values.firstname + values.lastname + values.email + values.message)
    sendContact(
      values.firstname,
      values.lastname,
      values.email,
      values.message
    );
  };
  const sendContact = useCallback(
    (firstname, lastname, email, message) => {
      const body = JSON.stringify({ firstname, lastname, email, message });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      // try{
      setContact({ ...contact, loading: true });
      axios
        .post(contactURL, body, config)
        .then((res) => {
          setContact({
            ...contact,
            success: `We have recieved your message, we will get back to you through your email(${res.data.email})`,
            error: null,
            loading: false,
          });
        })
        .catch((err) => {
          setContact({
            ...contact,
            error:
              "Something went wrong, unable to submit request successfully",
            loading: false,
          });
          console.log(err);
        });
      // }catch(err){
      // 	setContact({ ...contact, error: 'An error occured!' })
      // }
    },
    [contact]
  );
  useEffect(() => {
    document.title = "Contact | DC Miner";
  }, []);
  const { error, success, loading } = contact;
  return (
    <React.Fragment>
      <CssBaseline />
      <main width="100%">
        <OtherTop link="/contact" linkName="Contact" image={ImageBack} />
        <Container maxWidth="lg" className={classes.cardGrid} spacing={6}>
          <Grid container spacing={6}>
            <Grid
              item
              xs={12}
              lg={4}
              sm={12}
              md={5}
              elevation={6}
              style={{
                backgroundColor: "#2E3B55",
                borderRadius: 15,
                padding: 30,
                marginBottom: "5%",
              }}
            >
                <Container component="main" maxWidth="lg">
                  <CssBaseline />
                  <Bounce duration={500}>
                    <div className={classes.paper}>
                      <Grid
                        container
                        spacing={2}
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Grid item xs={12} sm={12}>
                          <div className={classes.iconGroup}>
                            <Avatar className={classes.avatar2}>
                              <ContactSupportIcon
                                className={classes.avatarIcon}
                                style={{
                                  color: "#00e6e6",
                                  backgoundColor: "4dff4d",
                                }}
                              />
                            </Avatar>
                            <MuiLink
                              href={`mailto:${process.env.REACT_APP_SUPPORT_MAIL}`}
                              className={classes.chip}
                              className="ml-1"
                            >
                              <Chip
                                size="small"
                                size="medium"
                                label={process.env.REACT_APP_SUPPORT_MAIL}
                                className={classes.chip}
                              />
                            </MuiLink>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Bounce>
                </Container>
            </Grid>
            <Grid
              item
              lg={8}
              sm={12}
              md={7}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 15,
                padding: 30,
              }}
              elevation={4}
            >
              <CssBaseline />
              {error !== null ? (
                <MuiAlert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </MuiAlert>
              ) : (
                <React.Fragment></React.Fragment>
              )}
              {success !== null ? (
                <MuiAlert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  {success}
                </MuiAlert>
              ) : (
                <React.Fragment></React.Fragment>
              )}
              <Typography
                component="h1"
                style={{ textAlign: "center" }}
                variant="h4"
              >
                Get in touch with us
              </Typography>
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
                    <Container component="main" maxWidth="lg">
                      <CssBaseline />
                      <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                          <ContactMailRoundedIcon />
                        </Avatar>
                        <form onSubmit={handleSubmit}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Slide left duration={500}>
                                <TextField
                                  error={
                                    errors.firstname && touched.firstname
                                      ? true
                                      : false
                                  }
                                  variant="filled"
                                  margin="normal"
                                  required
                                  fullWidth
                                  id="firstname"
                                  label="First Name"
                                  name="firstname"
                                  value={values.firstname}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  helperText={
                                    errors.firstname &&
                                    touched.firstname &&
                                    `${errors.firstname}`
                                  }
                                />
                              </Slide>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Slide right duration={500}>
                                <TextField
                                  error={
                                    errors.lastname && touched.lastname
                                      ? true
                                      : false
                                  }
                                  variant="filled"
                                  margin="normal"
                                  required
                                  fullWidth
                                  id="lastname"
                                  label="Last Name"
                                  name="lastname"
                                  value={values.lastname}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  helperText={
                                    errors.lastname &&
                                    touched.lastname &&
                                    `${errors.lastname}`
                                  }
                                />
                              </Slide>
                            </Grid>
                            <Grid item xs={12}>
                              <Slide left duration={700}>
                                <TextField
                                  error={
                                    errors.email && touched.email ? true : false
                                  }
                                  variant="filled"
                                  margin="normal"
                                  required
                                  fullWidth
                                  id="email"
                                  label="Email Address"
                                  name="email"
                                  value={values.email}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  helperText={
                                    errors.email &&
                                    touched.email &&
                                    `${errors.email}`
                                  }
                                />
                              </Slide>
                            </Grid>

                            <Grid item xs={12}>
                              <Slide left duration={900}>
                                <TextField
                                  error={
                                    errors.message && touched.message
                                      ? true
                                      : false
                                  }
                                  variant="filled"
                                  margin="normal"
                                  required
                                  fullWidth
                                  id="message"
                                  multiline
                                  label="Your Message"
                                  name="message"
                                  value={values.message}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  helperText={
                                    errors.message &&
                                    touched.message &&
                                    `${errors.message}`
                                  }
                                />
                              </Slide>
                            </Grid>
                          </Grid>
                          <Slide right duration={1000}>
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              style={{
                                backgroundColor: "#2E3B55",
                                color: "white",
                              }}
                              className={classes.submit}
                              disabled={!(dirty && isValid) || loading}
                            >
                              {loading ? "SENDING" : "SEND"}
                            </Button>
                          </Slide>
                        </form>
                      </div>
                    </Container>
                  );
                }}
              </Formik>
            </Grid>
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default Contact;
