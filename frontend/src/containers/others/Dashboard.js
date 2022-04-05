import React, { useState, useEffect, useRef, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Paper,
} from "@material-ui/core";
import Color from "../../constants/Color";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import TabPanel, { LinkTab, a11yProps } from "../../components/TabPanel";
import { Formik } from "formik";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ChangePassword from "../auth/ChangePassword";
import {
  loadUserImage,
  update_user,
  submit_billing,
  makeWithdrawalRequest,
} from "../../actions/authActions";
import CameraEnhanceRoundedIcon from "@material-ui/icons/CameraEnhanceRounded";
import { bankListUrl, extraURL, profilepicURL } from "../../constants";
import { createMessage, returnErrors } from "../../actions/messages";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import axios from "axios";
import { LOADING, STOP_LOADING } from "../../actions/loadingTypes";
import { Link } from "react-router-dom";
import FileCopyRounded from "@material-ui/icons/FileCopyRounded";
import Referrals from "../../components/common/Referrals";
import { useHistory } from "react-router-dom";
import UserWithdrawals from "../../components/common/UserWithdrawals";
import { Zoom, Bounce, Fade as FadeReveal } from "react-reveal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // flexGrow: 1,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(0, 0, 0),
    borderRadius: 20,
  },
  inputRoot: {
    color: "inherit",
  },
  appBar: {
    backgroundColor: "#2E3B55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  menuButton: {
    marginRight: 36,
    // marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  userAvatar: {
    alignSelf: "center",
    width: "20vh",
    height: "20vh",
  },
  cardHeader: {
    backgroundColor: Color.dcminer,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

function Dashboard({
  user,
  isLoading,
  makeWithdrawalRequest,
  userImage,
  submit_billing,
  userPackage,
  update_user,
}) {
  const upload = useRef();
  const picFormRef = useRef();
  const [value, setValue] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const [btnDisplay, setBtnDisplay] = React.useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [bankList, setBankList] = useState([]);
  const history = useHistory();
  const [state, setstate] = useState({
    image: null,
    comments: 0,
    replies: 0,
    articles: 0,
    referal_code: "",
    billingInfo: [],
    payment: [],
    referrals: [],
    withdrawals: [],
    total_earnings_ads: 0,
    total_earnings_ref: 0,
    total_earning: 0,
  });
  const dispatch = useDispatch();
  const alert = useAlert();
  const reader = new FileReader();
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const initialValues = {
    first_name: user && user.first_name,
    last_name: user && user.last_name,
    email: user && user.email,
  };
  const { billingInfo, payment } = state;
  const initialValues2 = {
    fullname: billingInfo && billingInfo.fullname,
    account_number: billingInfo && billingInfo.account_number,
    bank: billingInfo && billingInfo.bank,
    city: billingInfo && billingInfo.city,
    address1: billingInfo && billingInfo.address1,
    phone: billingInfo && billingInfo.phone,
  };
  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid Email";
    }
    if (!values.first_name) {
      errors.first_name = "First Name can't be empty";
    }
    if (!values.last_name) {
      errors.last_name = "Last Name can't be empty";
    }
    return errors;
  };

  const validate2 = (values) => {
    let errors = {};
    if (!values.fullname) {
      errors.fullname = "Full Name field can't be empty";
    }
    if (!values.account_number) {
      errors.account_number = "Account Number field can't be empty";
    }
    if (!values.bank) {
      errors.bank = "Bank field can't be empty";
    }
    if (!values.city) {
      errors.city = "City field can't be empty";
    }
    if (!values.address1) {
      errors.address1 = "Address field can't be empty";
    }
    if (!values.phone) {
      errors.phone = "Phone field can't be empty";
    }
    return errors;
  };

  const submitForm = (values) => {
    update_user(values.first_name, values.last_name);
    console.log(`%c Submitted`, "color: green; font-size: 1.5rem");
  };
  const submitForm2 = (values) => {
    console.log(`%c Submitted`, "color: green; font-size: 1.5rem");
    submit_billing(
      values.fullname,
      values.address1,
      values.city,
      values.phone,
      values.account_number,
      values.bank
    );
  };
  const classes = useStyles();

  const uploadImage = (e) => {
    const theImage = e.target.files[0];

    if (!theImage) {
      alert.error("Please select an image!");
      return false;
    }
    if (!theImage.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      alert.error("Please select a valid image ");
      return false;
    }
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setstate({ ...state, image: theImage });
        setBtnDisplay(true);
        setImageFile(URL.createObjectURL(theImage));
      };
      img.onerror = () => {
        alert.error("Invalid image content");
        return false;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(theImage);

    // setstate({ ...state, image: e.target.files[0] })
  };
  const handlePicSubmit = (e) => {
    e.preventDefault();
    // console.log(state)
    if (localStorage.getItem("access")) {
      try {
        dispatch({
          type: LOADING,
        });
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `JWT ${localStorage.getItem("access")}`,
          },
        };
        let form_data = new FormData();
        form_data.append("image", state.image);
        axios
          .put(profilepicURL(parseInt(userImage.id)), form_data, config)
          .then((res) => {
            dispatch(
              createMessage({ imageUploadSuc: " Profile updated successfully" })
            );
            dispatch({
              type: STOP_LOADING,
            });
            setBtnDisplay(false);
          })
          .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch(
              createMessage({ imageUpdateFail: "Unable to update image" })
            );
            dispatch({
              type: STOP_LOADING,
            });
          });
      } catch (err) {
        dispatch(createMessage({ imageUpdateFail: "Unable to update image" }));
        dispatch({
          type: STOP_LOADING,
        });
      }
    } else {
      dispatch(createMessage({ imageUpdateFail: "Unable to update image" }));
    }
  };
  const fetchExtras = useCallback(() => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };
      try {
        axios
          .get(extraURL, config)
          .then((res) => {
            // console.log(res.data)
            setstate({
              ...state,
              comments: res.data.numOfComments,
              replies: res.data.numOfReplies,
              articles: res.data.numOfArticles,
              billingInfo: res.data.billingInfo,
              payment: res.data.payment,
              referal_code: res.data.referal_code,
              referrals: res.data.referrals,
              withdrawals: res.data.withdrawals,
              total_earnings_ads: res.data.total_earnings_ads,
              total_earnings_ref: res.data.total_earnings_ref,
              total_earning: res.data.total_earning,
            });
            // console.log(res.data);
            dispatch(createMessage({ extra: " Extras gotten successfully" }));
          })
          .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            // console.log(err)
            alert.error("failed to updatate data!");
          });
      } catch (err) {
        alert.error("An error occured!");
      }
    } else {
      dispatch(createMessage({ imageUpdateFail: "Unable to get details" }));
      alert.error("Not Alert!");
    }
  }, [state, dispatch]);

  const fetchBankList = useCallback(() => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };
      try {
        axios
          .get(bankListUrl, config)
          .then((res) => {
            setBankList(res.data.data);
            // console.log(res.data);
          })
          .catch((err) => {
            err && alert.error("Can't fetch banks");
          });
      } catch (err) {
        alert.error("An error occured fetching available banks");
        console.log(err);
      }
    } else {
      alert.info("Authorization not provided!");
    }
  }, [bankList]);
  const getCurrentImage = useCallback(
    (image) => {
      setImageFile(image.image);
    },
    [imageFile]
  );
  useEffect(() => {
    userImage && getCurrentImage(userImage);
    fetchBankList();
  }, [userImage]);
  useEffect(() => {
    fetchExtras();
  }, []);
  useEffect(() => {
    document.title =
      user && user.first_name
        ? `DC Miner | ${user.first_name} ${user.last_name}`
        : "DC Miner";
  }, [user]);
  const handleCopy = (e) => {
    const ref_link = `${process.env.REACT_APP_API_URL}/auth/register/${state.referal_code}`;
    if (navigator.clipboard) {
      if (navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ref_link);
        alert.info("Copied!");
      }
    }
  };
  const requestWithdraw = () => {
    if (
      state.billingInfo &&
      state.billingInfo.fullname &&
      state.billingInfo.bank &&
      state.billingInfo.account_number
    ) {
      makeWithdrawalRequest();
    } else {
      alert.info("Complete your profile to make a request!");
      setValue(1);
    }
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <main width="100%">
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8} md={7} sm={12}>
              <AppBar position="static" className={classes.appBar}>
                <Tabs
                  variant="fullWidth"
                  value={value}
                  onChange={handleChange}
                  aria-label="nav tabs example"
                >
                  <LinkTab label="Profile" href="/drafts" {...a11yProps(0)} />
                  <LinkTab label="Others" href="/trash" {...a11yProps(1)} />
                  <LinkTab
                    label="Earnings and Referrals"
                    href="/spam"
                    {...a11yProps(2)}
                  />
                </Tabs>
              </AppBar>
              {/* TabPanel 1 for Profile*/}
              <TabPanel value={value} index={0}>
                <Zoom duration={500}>
                  <Card style={{ padding: 40 }} className={classes.card2}>
                    <Formik
                      enableReinitialize
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
                              <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} sm={12} md={6} lg={5}>
                                    <TextField
                                      error={
                                        errors.first_name && touched.first_name
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="first_name"
                                      label="First Name"
                                      name="first_name"
                                      value={values.first_name}
                                      // defaultValue={values.first_name}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      helperText={
                                        errors.first_name &&
                                        touched.first_name &&
                                        `${errors.first_name}`
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={6} lg={5}>
                                    <TextField
                                      error={
                                        errors.last_name && touched.last_name
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      name="last_name"
                                      label="Last Name"
                                      type="text"
                                      id="last_name"
                                      value={values.last_name}
                                      // defaultValue={values.last_name}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      helperText={
                                        errors.last_name &&
                                        touched.last_name &&
                                        `${errors.last_name}`
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={12} lg={10}>
                                    <TextField
                                      error={
                                        errors.email && touched.email
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="email"
                                      label="Email Address"
                                      name="email"
                                      value={values.email}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                      helperText="Email cannot be changed!"
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={12} lg={10}>
                                    <Button
                                      type="submit"
                                      fullWidth
                                      variant="contained"
                                      style={{
                                        backgroundColor: "#2E3B55",
                                        color: "white",
                                      }}
                                      className={classes.submit}
                                      disabled={
                                        !(dirty && isValid) || isLoading
                                      }
                                    >
                                      {isLoading ? "Saving..." : "Save"}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </form>
                            </div>
                            <Divider className="mt-5" />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Grid container className="mt-5">
                              <Grid item xs={12} sm={9} md={6} lg={6}>
                                <Button
                                  type="button"
                                  fullWidth
                                  onClick={handleModalOpen}
                                  variant="contained"
                                  style={{
                                    backgroundColor: "#2E3B55",
                                    color: "white",
                                  }}
                                  className={classes.submit}
                                >
                                  CHANGE PASSWORD
                                </Button>
                              </Grid>
                            </Grid>
                          </Container>
                        );
                      }}
                    </Formik>
                  </Card>
                </Zoom>
              </TabPanel>
              {/* TabPanel 2 for others */}
              <TabPanel value={value} index={1}>
                <Zoom duration={500}>
                  <Card style={{ padding: 40 }} className={classes.card2}>
                    <Formik
                      initialValues={initialValues2}
                      validate={validate2}
                      onSubmit={submitForm2}
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
                              <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField
                                      error={
                                        errors.account_number &&
                                        touched.account_number
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="account_number"
                                      label="Your Account Number"
                                      name="account_number"
                                      value={values.account_number}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      helperText={
                                        errors.account_number &&
                                        touched.account_number &&
                                        `${errors.account_number}`
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <FormControl
                                      variant="standard"
                                      style={{
                                        width: "100%",
                                        // alignContent: "flex-end",
                                        flex: 1,
                                        height: "100%",
                                      }}
                                    >
                                      <InputLabel
                                        id="demo-simple-select-helper-label"
                                        color={
                                          errors.bank && touched.bank
                                            ? "secondary"
                                            : "primary"
                                        }
                                      >
                                        Select your bank
                                      </InputLabel>
                                      <Select
                                        error={
                                          errors.bank && touched.bank
                                            ? true
                                            : false
                                        }
                                        labelId="bank"
                                        id="bank"
                                        name="bank"
                                        value={values.bank}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                      >
                                        <MenuItem value="">
                                          <em>None</em>
                                        </MenuItem>
                                        {bankList &&
                                          bankList.map((bank, index) => (
                                            <MenuItem
                                              value={bank.code}
                                              key={index}
                                            >
                                              {bank.name}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                      <FormHelperText style={{ color: "red" }}>
                                        {errors.bank &&
                                          touched.bank &&
                                          `${errors.bank}`}
                                      </FormHelperText>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={12} lg={10}>
                                    <TextField
                                      error={
                                        errors.fullname && touched.fullname
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="fullname"
                                      label="Full Name on account"
                                      name="fullname"
                                      value={values.fullname}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      helperText={
                                        errors.fullname &&
                                        touched.fullname &&
                                        `${errors.fullname}`
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={12} lg={10}>
                                    <TextField
                                      error={
                                        errors.address1 && touched.address1
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="address1"
                                      label="Address 1"
                                      name="address1"
                                      value={values.address1}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      helperText={
                                        errors.address1 &&
                                        touched.address1 &&
                                        `${errors.address1}`
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={6} lg={5}>
                                    <TextField
                                      error={
                                        errors.city && touched.city
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="city"
                                      label="Your City"
                                      name="city"
                                      value={values.city}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      helperText={
                                        errors.city &&
                                        touched.city &&
                                        `${errors.city}`
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={6} lg={5}>
                                    <TextField
                                      error={
                                        errors.phone && touched.phone
                                          ? true
                                          : false
                                      }
                                      variant="standard"
                                      margin="normal"
                                      required
                                      fullWidth
                                      name="phone"
                                      label="Phone Number"
                                      type="text"
                                      id="phone"
                                      value={values.phone}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      helperText={
                                        errors.phone &&
                                        touched.phone &&
                                        `${errors.phone}`
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={12} lg={10}>
                                    <Button
                                      type="submit"
                                      fullWidth
                                      variant="contained"
                                      style={{
                                        backgroundColor: "#2E3B55",
                                        color: "white",
                                      }}
                                      className={classes.submit}
                                      disabled={
                                        !(dirty && isValid) || isLoading
                                      }
                                    >
                                      {isLoading ? "Saving..." : "Save"}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </form>
                            </div>
                          </Container>
                        );
                      }}
                    </Formik>
                  </Card>
                </Zoom>
              </TabPanel>
              {/* Tabpanel 3 for Ref and Earnings */}
              <TabPanel value={value} index={2}>
                <Zoom duration={500}>
                  <Card style={{ paddingTop: 5 }}>
                    <Container component="main">
                      <CssBaseline />
                      <div className={classes.paper}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={12} md={12} lg={10}>
                            <Card
                              className={classes.card2}
                              style={{ outline: "none" }}
                            >
                              <CardHeader
                                title="Referral Link"
                                subheader="Make your friends register with the link below:"
                              />
                              <CardContent>
                                <Grid
                                  container
                                  // justify="space-between"
                                  alignItems="center"
                                >
                                  <Grid item xs={11} lg={11} sm={10} md={11}>
                                    <MuiLink
                                      href={`${process.env.REACT_APP_API_URL}/auth/register/${state.referal_code}`}
                                    >
                                      <Chip
                                        size="medium"
                                        variant="default"
                                        // color="primary"
                                        style={{
                                          width: "100%",
                                          backgroundColor: Color.dcminer,
                                          color: "white",
                                          fontWeight: "bold",
                                          fontFamily: "monospace",
                                        }}
                                        label={`${process.env.REACT_APP_API_URL}/auth/register/${state.referal_code}`}
                                      />
                                    </MuiLink>
                                  </Grid>
                                  <Grid item xs={1} lg={1} sm={2} md={1}>
                                    <IconButton
                                      className="mybtn"
                                      onClick={handleCopy}
                                    >
                                      <FileCopyRounded />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </CardContent>
                              <Divider />
                              <CardContent>
                                <Grid container>
                                  <Grid item xs={12} md={12}>
                                    {userPackage === null ? (
                                      <div
                                        style={{ padding: 40 }}
                                        className={classes.card2}
                                      >
                                        <Typography component="h4" variant="h4">
                                          Hey there!
                                        </Typography>

                                        <Typography variant="body2">
                                          You haven't choosen any package yet!
                                        </Typography>
                                        <div
                                          style={{
                                            display: "flex",
                                            marginTop: 5,
                                            flexDirection: "row",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Button
                                            variant="contained"
                                            fullWidth
                                            style={{
                                              backgroundColor: Color.dcminer,
                                              color: "white",
                                            }}
                                            onClick={() =>
                                              history.push("/payment/packages")
                                            }
                                          >
                                            Choose a package to start earning
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        style={{ padding: 40 }}
                                        className={classes.card2}
                                      >
                                        <h4>Amount Earned</h4>
                                        <div>
                                          <Grid
                                            container
                                            className="mt-5"
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <Grid
                                              item
                                              className="text-center text-capitalize"
                                              xs={6}
                                              sm={6}
                                              lg={6}
                                              md={6}
                                              style={{ flex: 1 }}
                                            >
                                              <Typography variant="h4">
                                                <del
                                                  style={{
                                                    textDecorationStyle:
                                                      "double",
                                                  }}
                                                >
                                                  N
                                                </del>
                                                {state &&
                                                  state.total_earnings_ads.toLocaleString(
                                                    "en-US"
                                                  )}
                                              </Typography>
                                              <Typography component="p">
                                                Ads
                                              </Typography>
                                            </Grid>
                                            <Grid
                                              item
                                              className="text-center text-capitalize"
                                              xs={6}
                                              sm={6}
                                              lg={6}
                                              md={6}
                                              style={{ flex: 1 }}
                                            >
                                              <Typography variant="h4">
                                                <del
                                                  style={{
                                                    textDecorationStyle:
                                                      "double",
                                                  }}
                                                >
                                                  N
                                                </del>
                                                {state &&
                                                  state.total_earnings_ref.toLocaleString(
                                                    "en-US"
                                                  )}
                                              </Typography>
                                              <Typography component="p">
                                                Referrals
                                              </Typography>
                                            </Grid>
                                            <Grid
                                              container
                                              className="mt-5"
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                              }}
                                            >
                                              <Grid
                                                item
                                                className="text-center text-capitalize"
                                                xs={12}
                                                sm={12}
                                                lg={12}
                                                md={12}
                                                style={{ flex: 1 }}
                                              >
                                                <Typography variant="h2">
                                                  <del
                                                    style={{
                                                      textDecorationStyle:
                                                        "double",
                                                    }}
                                                  >
                                                    N
                                                  </del>
                                                </Typography>
                                                <Typography variant="h3">
                                                  {state &&
                                                    state.total_earning.toLocaleString(
                                                      "en-US"
                                                    )}
                                                </Typography>
                                                <Typography component="p">
                                                  Total
                                                </Typography>
                                              </Grid>
                                              <Button
                                                style={{
                                                  backgroundColor:
                                                    Color.dcminer,
                                                  color: "white",
                                                }}
                                                fullWidth
                                                onClick={requestWithdraw}
                                              >
                                                Withdraw
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        </div>
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>
                              </CardContent>
                              <Divider />
                            </Card>
                          </Grid>
                        </Grid>
                      </div>
                      <Divider style={{ margin: 20 }} />
                      <div>
                        <Grid container>
                          <Grid item xs={12} md={12} sm={12} lg={12}>
                            {userPackage === null ? (
                              <React.Fragment></React.Fragment>
                            ) : (
                              <Zoom duration={500}>
                                <Referrals referrals={state.referrals} />
                              </Zoom>
                            )}
                          </Grid>
                        </Grid>
                      </div>
                      <div>
                        <Grid container>
                          <Grid item xs={12} md={12} sm={12} lg={12}>
                            {userPackage === null ? (
                              <React.Fragment></React.Fragment>
                            ) : (
                              <Zoom duration={500}>
                                <UserWithdrawals
                                  withdrawals={state.withdrawals}
                                />
                              </Zoom>
                            )}
                          </Grid>
                        </Grid>
                      </div>
                    </Container>
                  </Card>
                </Zoom>
              </TabPanel>
            </Grid>
            {/* Profile card */}
            <Grid item xs={12} lg={4} md={5} sm={12} className={classes.card1}>
              <Card elevation={6} style={{ borderRadius: 10 }}>
                <div
                  className={classes.cardHeader}
                  style={{ height: "20vh" }}
                ></div>
                <div
                  className={classes.cardHeader + " pb-3 pt-3"}
                  style={{
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    positon: "relative",
                  }}
                >
                  <div style={{ position: "absolute", zIndex: 2 }}>
                    <form
                      onSubmit={(e) => {
                        handlePicSubmit(e);
                      }}
                      ref={(f) => {
                        picFormRef.current = f;
                      }}
                      encType="multipart/form-data"
                    >
                      <input
                        type="file"
                        ref={upload}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={(e) => uploadImage(e)}
                      />

                      {btnDisplay ? (
                        <Button
                          type="submit"
                          className="mybtn"
                          style={{ color: "#ffffff" }}
                        >
                          Update Picture
                        </Button>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </form>
                    <FadeReveal duration={700}>
                      <IconButton
                        className="mybtn"
                        onClick={(e) => upload.current.click()}
                      >
                        <Avatar
                          className={classes.userAvatar}
                          title={
                            user &&
                            user.first_name +
                              " " +
                              (user.firs_name ? user.last_name : " ")
                          }
                          src={imageFile}
                          ref={picFormRef}
                        >
                          <CameraEnhanceRoundedIcon
                            style={{
                              zIndex: "999999999999",
                              width: "7vw",
                              height: "7vh",
                            }}
                          />
                        </Avatar>
                      </IconButton>
                    </FadeReveal>
                  </div>
                </div>

                <hr />
                <CardContent>
                  <Grid
                    container
                    className="mt-5"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <Grid
                      item
                      className="text-center text-capitalize"
                      xs={4}
                      sm={4}
                      lg={4}
                      md={4}
                      style={{ flex: 1 }}
                    >
                      <Bounce duration={500}>
                        <Typography variant="h5">
                          {state && state.comments}
                        </Typography>
                      </Bounce>
                      <Typography component="p">Comments</Typography>
                    </Grid>
                    <Grid
                      item
                      className="text-center text-capitalize"
                      xs={4}
                      sm={4}
                      lg={4}
                      md={4}
                      style={{ flex: 1 }}
                    >
                      <Bounce duration={500}>
                        <Typography variant="h4">
                          {state && state.referrals.length}
                        </Typography>
                      </Bounce>
                      <Typography component="p">Referrals</Typography>
                    </Grid>
                    <Grid
                      item
                      className="text-center text-capitalize"
                      xs={4}
                      sm={4}
                      lg={4}
                      md={4}
                      style={{ flex: 1 }}
                    >
                      <Bounce duration={500}>
                        <Typography variant="h5">
                          {state && state.replies}
                        </Typography>
                      </Bounce>
                      <Typography component="p">Replies</Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className="mt-5"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <Grid
                      item
                      className="text-center"
                      xs={12}
                      sm={12}
                      lg={12}
                      md={12}
                      style={{ flex: 1 }}
                    >
                      <h4 className="text-capitalize">
                        {user &&
                          user.first_name +
                            " " +
                            (user.last_name ? user.last_name : " ")}
                      </h4>
                      <b>{userPackage && userPackage.package_title}</b>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className="mt-5"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <Grid
                      item
                      className="text-center"
                      xs={12}
                      sm={12}
                      lg={12}
                      md={12}
                      style={{ flex: 1 }}
                    >
                      <b>{user && user.email}</b>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>

      {/* change password modal */}
      <Modal
        aria-labelledby="passwordModal"
        aria-describedby="passWordModal"
        className={classes.modal}
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paperModal} elevation={8}>
            <Card elevation={0}>
              <CardHeader subheader="Change Password" className="text-center" />
              <CardContent>
                <ChangePassword />
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  onClick={handleModalClose}
                  className="mybtn ml-auto"
                >
                  CANCEL
                </Button>
              </CardActions>
            </Card>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  perm: state.authReducer.permissions,
  userImage: state.authReducer.userImage,
  isLoading: state.loadReducer.isLoading,
  userPackage: state.authReducer.package,
});
export default connect(mapStateToProps, {
  loadUserImage,
  update_user,
  submit_billing,
  makeWithdrawalRequest,
})(Dashboard);
