import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import HtmlParse from "react-html-parser";
import { useTheme } from "@material-ui/core/styles";
const ConfirmDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.openDialog && props.openDialog}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {props.dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{HtmlParse(props.dialogText)}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={props.handleClose}
          color="default"
          className="mybtn"
        >
          No
        </Button>
        <Button
          onClick={() => {
            props.confirmExecution();
            props.handleClose();
          }}
          color="primary"
          className="mybtn"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
