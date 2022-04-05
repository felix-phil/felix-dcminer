import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  checkAuthenticated,
  loadUser,
  // googleAuthentication,
  loadUserPerm,
  loadUserImage,
  loadUserPackage,
  checkUpgradeStatus,
} from "../actions/authActions";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import { Detector } from "react-detect-offline";
import MuiAlert from "@material-ui/lab/Alert";
import CloudOffRoundedIcon from "@material-ui/icons/CloudOffRounded";
import { Bounce } from "react-reveal";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: "#2E3B55",
  },
}));

const Layout = ({
  loadUser,
  checkAuthenticated,
  // googleAuthentication,
  loadUserImage,
  loadUserPerm,
  children,
  isLoading,
  loadUserPackage,
  checkUpgradeStatus,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openOffline, setOpenOffline] = useState(true);
  const location = useLocation()
  const ref = useRef()
  // let location = useLocation();
  const handleOfflineClick = () => {
    setOpenOffline(true);
  };

  const handleOfflineClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenOffline(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadUser();
    loadUserPerm();
    checkAuthenticated();
    loadUserImage();
    loadUserPackage();
    checkUpgradeStatus();
  }, []);
  useEffect(() => {
    isLoading ? setOpen(true) : setOpen(false);
  }, [isLoading]);
  useEffect(() => {
    ref.current && ref.current.scrollIntoView()
  }, [location])
  return (
    <div ref={ref}>
      <Detector
        render={({ online }) => (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            style={{ zIndex: 999999 }}
            open={!online}
            autoHideDuration={6000}
            onClose={handleOfflineClose}
          >
          <Bounce forever duration={10000}>
            <MuiAlert icon={<CloudOffRoundedIcon />} severity="info">
              You are offline, connect to the internet!
            </MuiAlert>
            </Bounce>
          </Snackbar>
        )}
        polling={false}
      />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </div>
  );
};
const mapStateToProps = (state) => ({
  isLoading: state.loadReducer.isLoading,
});
export default connect(mapStateToProps, {
  checkAuthenticated,
  loadUser,
  loadUserPerm,
  loadUserImage,
  // googleAuthentication,
  loadUserPackage,
  checkUpgradeStatus,
})(Layout);
