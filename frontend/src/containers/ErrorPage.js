import React from "react";
import { Avatar, Button, IconButton, makeStyles } from "@material-ui/core";
import Color from "../constants/Color";
import { Link, useHistory } from "react-router-dom";
import WorkOffRoundedIcon from "@material-ui/icons/WorkOffRounded";
import RefreshRoundedIcon from "@material-ui/icons/RefreshRounded";

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
    background: "transparent",
    // background: Color.dcminer,
  },
  avatar2: {
    height: "40vh",
    width: "40vh",
    fill: Color.dcminer,
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
const ErrorPage = () => {
  const classes = useStyle();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar}>
        <WorkOffRoundedIcon className={classes.avatar2} />
      </Avatar>
      <div className={classes.text}>
        <div>
          <h5>Sorry!</h5>
          <p>No data!</p>
          <IconButton className="mybtn" onClick={() => history.go(0)}>
            <RefreshRoundedIcon />
          </IconButton>
          <h5>Refresh</h5>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
