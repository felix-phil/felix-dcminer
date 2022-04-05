import React from "react";
import SentimentDissatisfiedRoundedIcon from "@material-ui/icons/SentimentDissatisfiedRounded";
import { Avatar, Button, makeStyles } from "@material-ui/core";
import Color from "../constants/Color";
import { Link, useHistory } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(7),
  },
  avatar: {
    height: "40vh",
    width: "40vh",
    // background: "transparent",
    background: Color.dcminer,
  },
  avatar2: {
    height: "40vh",
    width: "40vh",
    // fill: Color.dcminer,
  },
  text: {
    fontFamily: "'Open Sans' 'Arial' 'Calibri'",
    textAlign: "center",
  },
  theText: {
    fontSize: "7rem",
    color: Color.dcminer,
  },
  //   group: {
  //     lineHeight: "none",
  //   },
}));
const Page404 = () => {
  const classes = useStyle();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar}>
        <SentimentDissatisfiedRoundedIcon className={classes.avatar2} />
      </Avatar>
      <div className={classes.text}>
        <h1 className={classes.theText}>404</h1>
        <div>
          <h5>Sorry!</h5>
          <p>The page you requested for cannot be found!</p>
          <p>
            You can{" "}
            <Button variant="text" onClick={history.goBack}>
              Go Back
            </Button>{" "}
            or <Link to="/">Go Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page404;
