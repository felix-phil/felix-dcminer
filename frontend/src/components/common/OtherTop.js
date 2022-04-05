import React from "react";
import {
  Breadcrumbs,
  Card,
  CardActions,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: "#e6e6e6",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  topCon: {
    position: "absolute",
    zIndex: theme.zIndex.cardContent + 1,
    color: "white",
    left: "50%",
    width: "100%",
    height: "100%",
    paddingRight: "50%",
    paddingLeft: "50%",
    paddingBottom: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#2E3B55",
    opacity: 0.3,
    fontSize: "10vh",
  },
}));

const OtherTop = (props) => {
  const classes = useStyles();
  return (
    <Fade duration={1500}>
      <div className={classes.heroContent}>
        <Grid container>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ border: "none" }}>
            <Card className={classes.card} style={{ position: "relative" }}>
              <CardMedia
                image={props.image}
                title="DC Miner"
                style={{ height: "50vh" }}
              />
              {/* <div style={{ height: "50vh", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                {props.children}
              </div> */}
              <CardActions
                className="mt-auto ml-auto mr-auto"
                style={{ zIndex: "99", backgroundColor: "none" }}
              >
                <Breadcrumbs aria-label="breadcrumb" separator=">">
                  <Link color="inherit" to="/" className="text-dark">
                    DC Miner
                  </Link>
                  <Typography
                    color="textPrimary"
                    to={props.link}
                    aria-current="page"
                  >
                    {props.linkName}
                  </Typography>
                </Breadcrumbs>
              </CardActions>
              <div className={classes.topCon}></div>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Fade>
  );
};

export default OtherTop;
