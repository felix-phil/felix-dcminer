import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Card, CardActions, CardHeader, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useAlert } from "react-alert";
import { planDetail, paramsURL, paymentURL } from "../../constants";
import axios from "axios";
import CardContent from "@material-ui/core/CardContent";
import Color from "../../constants/Color";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChevronRightRounded from "@material-ui/icons/ChevronRightRounded";
import ChevronLeftRounded from "@material-ui/icons/ChevronLeftRounded";
import ScriptTag from "react-script-tag";
import { Redirect, useHistory } from "react-router-dom";
import { Zoom } from "react-reveal";
import Count from 'react-countup';

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

const Checkout = (props) => {
  const classes = useStyles();
  const alert = useAlert();
  const [tier, setTier] = useState({});
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState({});
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
  });
  useEffect(() => {
    document.title = `DC Miner | ${props.match.params.tier}`;
    fetchPlan(props.match.params.tier);
    fetchPaymentParams(props.match.params.tier);
    state.loading === true ? setOpen(true) : setOpen(false);
  }, [props.match.params.tier, state.loading]);
  const recordPayment = (
    txRef,
    transactionComplete,
    refKey,
    transaction_id,
    payment_type
  ) => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const body = {
        txRef,
        transactionComplete,
        refKey,
        transaction_id,
        payment_type,
      };

      try {
        setState({ ...state, loading: true });
        axios
          .post(paymentURL, body, config)
          .then((res) => {
            alert.success("Payment recorded");
            setState({ ...state, loading: false });
          })
          .catch((err) => {
            err && alert.error("Something went wrong");
            setState({ ...state, loading: false });
          });
      } catch (err) {
        err && alert.error("Something went wrong!!");
        setState({ ...state, loading: false });
      }
    } else {
      console.log("Authentication details were not provided!");
    }
  };
  const fetchPaymentParams = useCallback(
    (tier) => {
      if (localStorage.getItem("access")) {
        try {
          const config = {
            headers: {
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },
          };
          setState({ ...state, loading: false });
          axios
            .get(paramsURL(tier), config)
            .then((res) => {
              setParams({ ...res.data, payment_options: "card" });
              setState({ ...state, loading: false });
            })
            .catch((err) => {
              setState({ ...state, loading: false });
              err && alert.error("Unable to get payment parameters!");
            });
        } catch (err) {
          setState({ ...state, loading: false });
          err && alert.error("Something went wrong!");
        }
      } else {
        alert.error("Authentication details not provided!");
      }
    },
    [tier]
  );
  const fetchPlan = useCallback(
    (tiername) => {
      if (localStorage.getItem("access")) {
        try {
          const config = {
            headers: {
              Authorization: `JWT ${localStorage.getItem("access")}`,
            },
          };
          setState({ ...state, loading: false });
          axios
            .get(planDetail(tiername), config)
            .then((res) => {
              setTier(res.data);
              setState({ ...state, loading: false });
            })
            .catch((err) => {
              setState({ ...state, loading: false });
              err && alert.error("Something went wrong!");
            });
        } catch (err) {
          setState({ ...state, loading: false });
          err && alert.error("Something went wrong!");
        }
      } else {
        alert.error("Authentication details not provided!");
      }
    },
    [tier]
  );
  const makePayment = () => {
    try {
      FlutterwaveCheckout({
        ...params,
        callback: function (data) {
          console.log(data);
          if (data && data.status == "successful") {
            recordPayment(
              data.tx_ref,
              true,
              data.flw_ref,
              data.transaction_id,
              tier.name
            );
          } else {
            alert.error(data.status);
          }
        },
        onClose: function (e) {
          e.preventDefault();
          console.log("Closed");
        },
      });
    } catch (err) {
      err && console.log(err.name);
      err &&
        alert.error(
          "Unable to reach payment gateway, try again later or refresh this page!"
        );
    }
  };
  if (props.userPackage !== null) {
    return <Redirect to="/" />;
  }
  return (
    <React.Fragment>
      <Backdrop open={open} className={classes.backdrop}>
        <CircularProgress />
      </Backdrop>
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Payment
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          Click continue to pay.
        </Typography>
      </Container>
      <Container maxWidth="sm" component="main">
        <Grid container spacing={5} alignItems="center" justify="center">
          <Grid item xs={12} md={12} sm={12} lg={12}>
            <IconButton className="mybtn" onClick={() => history.goBack()}>
              <ChevronLeftRounded />
            </IconButton>
            <Zoom duration={100}>
              <Card>
                <CardHeader
                  title={tier && tier.title}
                  subheader="Package"
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  // action=""
                  className={classes.cardHeader}
                />
                <CardContent>
                  <Typography
                    component="h5"
                    variant="body1"
                    color="textPrimary"
                    align="center"
                  >
                    Amount
                  </Typography>
                  <div className={classes.cardPricing}>
                    <Typography component="h3" variant="h3" color="textPrimary">
                      <del style={{ textDecorationStyle: "double" }}>N</del>
                      {/* {tier.amount
                        ? parseInt(tier.amount).toLocaleString()
                        : ""} */}
                        {tier.amount && <Count
                          end={tier.amount}
                          duration={1}
                          separator=","
                        >
                        </Count>}
                    </Typography>
                  </div>

                  <ul>
                    <Typography
                      component="li"
                      variant="h6"
                      align="center"
                      style={{ textAlign: "center" }}
                    >
                      Benefits
                    </Typography>
                    {tier &&
                      tier.description &&
                      tier.description.map((line) => (
                        <Typography
                          component="li"
                          variant="subtitle1"
                          align="center"
                          key={line}
                        >
                          {line}
                        </Typography>
                      ))}
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                      key="somuchmore"
                    >
                      and more...
                    </Typography>
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="mybtn"
                    style={{ backgroundColor: Color.dcminer }}
                    onClick={makePayment}
                  >
                    Continue <ChevronRightRounded />
                  </Button>
                </CardActions>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
      <ScriptTag
        isHydrating={false}
        type="text/javascript"
        src="https://checkout.flutterwave.com/v3.js"
      ></ScriptTag>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => ({
  userPackage: state.authReducer.package,
});
export default connect(mapStateToProps, {})(Checkout);
