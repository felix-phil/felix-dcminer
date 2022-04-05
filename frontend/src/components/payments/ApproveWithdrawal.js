import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { approvePayment } from "../../actions/withdrawalActions";
import { connect } from "react-redux";

const ApproveWithdrawal = (props) => {
  const { approvePayment } = props;
  const [amount_approved, setAmount_approved] = useState(props.amount);
  useEffect(() => {
    setAmount_approved(props.amount);
  }, [props.amount]);
  const handleChange = (e) => {
    setAmount_approved(e.target.value.replace(/[^0-9]/g, ""));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount_approved <= props.amount && amount_approved > 0) {
      approvePayment(props.id, amount_approved);
      props.handleClose();
    }
  };
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Approve Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the amount to be paid for this withdrawal
          </DialogContentText>
          <DialogContentText>
            Requested: <b>{props.amount}</b>
          </DialogContentText>
          <TextField
            autoFocus
            error={
              amount_approved > props.amount || amount_approved === 0
                ? true
                : false
            }
            value={amount_approved}
            margin="dense"
            id="amount_approved"
            label="Amount to Approve"
            type="number"
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="default" className="mybtn">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            className="mybtn"
            disabled={
              amount_approved > props.amount || amount_approved === 0
                ? true
                : false
            }
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default connect(null, { approvePayment })(ApproveWithdrawal);
