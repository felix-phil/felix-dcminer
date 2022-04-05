import React, { useState, useRef, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { verify } from "../../actions/authActions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";
import { Alert as MuiAlert, AlertTitle } from "@material-ui/lab";
import { useAlert } from "react-alert";

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
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const Activate = ({
  verify,
  match,
  isAuthenticated,
  isLoading,
  message,
  error,
}) => {
  const [verified, setVerified] = useState(false);
  const classes = useStyles();
  const prevProps = useRef({ message, error }).current;
  const alert = useAlert();
  const [messages, setMessages] = useState({
    aMessage: null,
    anError: null,
  });

  useEffect(() => {
    if (message !== prevProps.message) {
      if (message.accActSuc) {
        setMessages({
          ...messages,
          aMessage: message.accActSuc,
          anError: null,
        });
      }
    }
  }, [message]);
  useEffect(() => {
    document.title = "DC Miner | Activate";
  }, []);
  const onSubmitHandler = (e) => {
    const uid = match.params.uid;
    const token = match.params.token;

    verify(uid, token);
    // setVerified(true);
  };
  if (/*verified ||*/ isAuthenticated) {
    return <Redirect to="/auth/login" />;
  }
  const { aMessage, anError } = messages;
  return (
    <Container component="main" maxWidth="xs">
      {aMessage !== null ? (
        <React.Fragment>
          <MuiAlert severity="success" style={{ marginTop: "5%" }}>
            <AlertTitle>Activation Successful!</AlertTitle>
            {aMessage}
          </MuiAlert>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Link to="/payment/packages">
              <Button
                type="button"
                fullWidth
                variant="contained"
                style={{ backgroundColor: "#2E3B55", color: "white" }}
                className={classes.submit}
              >
                Continue
              </Button>
            </Link>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Activate Account
        </Typography>
        <Avatar className={classes.avatar}>
          <LockOpenRoundedIcon />
        </Avatar>
          <Button
            type="button"
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#2E3B55", color: "white" }}
            className={classes.submit}
            onClick={(e) => onSubmitHandler(e)}
          >
            {isLoading ? "ACTIVATING..." : "ACTIVATE"}
          </Button>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  isLoading: state.loadReducer.isLoading,
  message: state.messageReducer,
  error: state.errorReducer,
});
export default connect(mapStateToProps, { verify })(Activate);
