import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";
import Color from "../constants/Color";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { editCommentURL } from "../constants";
import { useAlert } from "react-alert";
import axios from "axios";
const EditComment = (props) => {
  const [comment, setComment] = useState(props.comment);
  const [myLoading, setMyLoading] = useState(false);
  const alert = useAlert();
  const theme = useTheme();
  const handleChange = (e) => {
    setComment(e.target.value);
  };
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  useEffect(() => {
    setComment(props.comment);
  }, [props.comment]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ comment: comment });
      try {
        setMyLoading(true);
        axios
          .patch(editCommentURL(props.id), body, config)
          .then(() => {
            setMyLoading(false);
            alert.success("Saved!");
            props.handleClose();
            props.reload();
          })
          .catch((err) => {
            setMyLoading(false);
            alert.error("Something went wrong!");
          });
      } catch (err) {
        setMyLoading(false);
        alert.error("An error occured");
        console.log(err);
      }
    } else {
      alert.error("Authentication details not provided");
    }
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.openDialog}
      onClose={props.handleClose}
      aria-labelledby="edit-dialog"
    >
      <DialogTitle id="edit-dialog">{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <form
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
            onSubmit={handleSubmit}
          >
            <TextField
              variant="outlined"
              id="comment"
              label={`Edit Comment`}
              multiline
              name="comment"
              rowsMax={2}
              style={{ borderRadius: 50 }}
              value={comment}
              fullWidth
              required
              onChange={(e) => handleChange(e)}
              style={{ flex: 1 }}
            />
            {/* </Grid> */}
            {/* <Grid item xs={2}> */}
            <Button
              type="submit"
              // variant="contained"
              style={{
                background: "none",
                color: Color.dcminer,
              }}
              className="mybtn"
              disabled={myLoading}
            >
              {myLoading ? "..." : <SendRoundedIcon />}
            </Button>
          </form>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={props.handleClose}
          color="secondary"
          className="mybtn"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditComment;
