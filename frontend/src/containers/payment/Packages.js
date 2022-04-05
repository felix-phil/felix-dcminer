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
import Box from "@material-ui/core/Box";
import { useAlert } from "react-alert";
import axios from "axios";
import { packageURL } from "../../constants";
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
          .get(packageURL, config)
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
  if (props.userPackage !== null) {
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
          Choose a package to continue.
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers &&
            tiers.map((tier, index) => (
              <Grid
                item
                key={tier.id}
                xs={12}
                sm={tier.name === "largebusiness" ? 12 : 6}
                md={4}
              >
                <Zoom duration={1000}>
                <Card>
                  <CardHeader
                    title={tier.modal_title}
                    subheader={
                      tier.name === "mediumbusiness" ? "Most Popular" : ""
                    }
                    titleTypographyProps={{ align: "center" }}
                    subheaderTypographyProps={{ align: "center" }}
                    action={
                      tier.name === "mediumbusiness" ? <StarIcon /> : null
                    }
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
                        {<Count
                          end={parseInt(tier.amount)}
                          duration={1.75}
                          separator=","
                        >
                        </Count>}
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
                      variant={index == 1 ? "contained" : "outlined"}
                      style={{
                        backgroundColor: `${
                          index == 1 ? Color.dcminer : "white"
                        }`,
                      }}
                      color="primary"
                      className="mybtn"
                      onClick={() => {
                        history.push(`/payment/checkout/${tier.name}`);
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
});
export default connect(mapStateToProps, {})(Packages);
