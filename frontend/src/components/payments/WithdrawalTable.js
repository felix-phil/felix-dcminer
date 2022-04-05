import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Button } from "@material-ui/core";
import Color from "../../constants/Color";
import ApproveWithdrawal from "./ApproveWithdrawal";
import ConfirmDialog from "../ConfirmDialog";
import { payUser } from "../../actions/withdrawalActions";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

export function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const [withId, setWithId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [confirmPay, setConfirmPay] = useState(false);
  const [rowPay, setRowPay] = useState({});
  const dispatch = useDispatch();
  const handleOpenConfirmPay = () => {
    setConfirmPay(true);
  };

  const handleConfirmClose = () => {
    setConfirmPay(false);
  };
  const handleApproveClickOpen = () => {
    setOpenApprove(true);
  };

  const handleApproveClose = () => {
    setOpenApprove(false);
  };
  const pay = () => {
    console.log(`Pay `, rowPay);
  };
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            className="mybtn"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.user.first_name}
        </TableCell>
        <TableCell align="right">{row.user.last_name}</TableCell>
        <TableCell align="right">{row.amount}</TableCell>
        <TableCell align="right">{row.amount_approved}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            className="mybtn"
            style={{ backgroundColor: Color.success, color: "white" }}
            // disabled={
            //   row.amount_approved > 0 && row.date_approved ? true : false
            // }
            onClick={() => {
              setWithId(row.id);
              setAmount(row.amount);
              handleApproveClickOpen();
            }}
          >
            Approve
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            color="primary"
            variant="contained"
            style={{ backgroundColor: Color.warning }}
            className="mybtn"
            onClick={() => {
              handleOpenConfirmPay();
              setRowPay(row);
              setWithId(row.id);
            }}
          >
            Pay
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Withdrawal Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Requested</TableCell>
                    <TableCell>Date Approved</TableCell>
                    <TableCell align="right">Account Name</TableCell>
                    <TableCell align="right">Account Number</TableCell>
                    <TableCell align="right">Bank</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {" "}
                      {new Date(Date.parse(row.date_requested)).toUTCString()}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {row.date_approved !== ""
                        ? new Date(Date.parse(row.date_approved)).toUTCString()
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {row.account_info.fullname}
                    </TableCell>
                    <TableCell align="right">
                      {row.account_info.account_number}
                    </TableCell>
                    <TableCell align="right">{row.account_info.bank}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <ApproveWithdrawal
        open={openApprove}
        handleClick={handleApproveClickOpen}
        handleClose={handleApproveClose}
        amount={amount}
        id={withId}
      />
      <ConfirmDialog
        openDialog={confirmPay}
        dialogTitle={`Pay ${rowPay.user && rowPay.user.first_name} ${
          rowPay.user && rowPay.user.last_name
        }`}
        dialogText={`Are you sure you want to pay: <br> Account Name - ${
          rowPay.account_info && rowPay.account_info.fullname
        } <br> Account Number - ${
          rowPay.account_info && rowPay.account_info.account_number
        } <br> Amount -  <b>${
          rowPay.account_info && rowPay.amount_approved
        }<b> ?`}
        handleClose={handleConfirmClose}
        confirmExecution={() => {
          dispatch(payUser(withId));
        }}
      />
    </React.Fragment>
  );
}
