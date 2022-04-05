import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import StarIcon from "@material-ui/icons/StarBorder";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useAlert } from "react-alert";
import axios from "axios";
import { upgradeURL } from "../../constants";
import { Redirect, useHistory } from "react-router-dom";
import Color from "../../constants/Color";
import Count from 'react-countup';
import Zoom from 'react-reveal';

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
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const Packages = (props) => {
  const classes = useStyles();
  const alert = useAlert();
  const [tiers, setTiers] = useState([]);
  const history = useHistory();
  useEffect(() => {
    document.title = "DC Miner | Packages";
    fetchPlans();
  }, []);
  const [state, setState] = useState({
    loading: false,
  });
  const fetchPlans = useCallback(() => {
    if (localStorage.getItem("access")) {
      try {
        const config = {
          headers: {
            Authorization: `JWT ${localStorage.getItem("access")}`,
          },
        };
        setState({ ...state, loading: false });
        axios
          .get(upgradeURL, config)
          .then((res) => {
            setTiers(res.data);
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
  }, [tiers]);
  if(!props.userPackage){
    return <Redirect to="/" />;
  }
  if (props.upgradeAble === false) {
    return <Redirect to="/" />;
  }
  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Choose a Package
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          Choose a package to upgrade.
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="center" justify="center">
          {tiers &&
            tiers.map((tier, index) => (
              <Grid item key={tier.id} xs={12} sm={12} md={6}>
                <Zoom duratioin={1000}>

                <Card>
                  <CardHeader
                    title={tier.modal_title}
                    titleTypographyProps={{ align: "center" }}
                    subheaderTypographyProps={{ align: "center" }}
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography
                        component="h3"
                        variant="h3"
                        color="textPrimary"
                      >
                        <del style={{ textDecorationStyle: "double" }}>N</del>
                        {/* {parseInt(
                          tier.amount - props.userPackage.amount
                        ).toLocaleString()} */}
                        <Count
                          end={tier.amount - props.userPackage.amount}
                          duration={1.75}
                          separator=","
                        >
                        </Count>
                      </Typography>
                    </div>
                    <ul>
                      {tier.pay_button_css_classes &&
                        tier.pay_button_css_classes.split(", ").map((line) => (
                          <Typography
                            component="li"
                            variant="subtitle1"
                            align="center"
                            key={line}
                          >
                            {line}
                          </Typography>
                        ))}
                    </ul>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className="mybtn"
                      style={{ backgroundColor: Color.dcminer }}
                      onClick={() => {
                        history.push(`/payment/upgrade/checkout/${tier.name}`);
                      }}
                    >
                      {tier.pay_button_text}
                    </Button>
                  </CardActions>
                </Card>
                </Zoom>
              </Grid>
            ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => ({
  userPackage: state.authReducer.package,
  upgradeAble: state.authReducer.upgradeAble,
});

export default connect(mapStateToProps, {})(Packages);
