import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@material-ui/core";
import DoneAllRoundedIcon from "@material-ui/icons/DoneAllRounded";
import CancelPresentationRoundedIcon from "@material-ui/icons/CancelPresentationRounded";
import Color from "../../constants/Color";

const columns = [
  { id: "amount_requested", label: "Amount Requested (NGN) ", minWidth: 170 },
  { id: "amount_approved", label: "Amount Approved (NGN)", minWidth: 170 },
  {
    id: "status",
    label: "Status (active)",
    minWidth: 100,
    align: "right",
  },
  {
    id: "approval_status",
    label: "Approval Status (approved)",
    minWidth: 100,
    align: "right",
  },
  {
    id: "payment_status",
    label: "Payment Status (paid)",
    minWidth: 100,
    align: "right",
  },
  {
    id: "date_requested",
    label: "Date Requested",
    minWidth: 170,
    align: "right",
  },
  {
    id: "date_approved",
    label: "Date Approved",
    minWidth: 170,
    align: "right",
  },
  {
    id: "date_paid",
    label: "Date Paid",
    minWidth: 170,
    align: "right",
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: "100%",
  },
  container: {
    maxWidth: "100%",
    maxHeight: 440,
  },
});

function UserWithdrawals(props) {
  const rows = props.withdrawals;

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const Yes = () => <DoneAllRoundedIcon style={{ fill: Color.success }} />;
  const No = () => (
    <CancelPresentationRoundedIcon style={{ fill: Color.danger }} />
  );
  return (
    <Paper className={classes.root}>
      <Typography
        variant="body2"
        style={{ fontFamily: "Calibri", fontSize: "1.5rem" }}
      >
        Withdrawals
      </Typography>

      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  //   align={column.align}
                  //   style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.amount.toFixed()}</TableCell>
                    <TableCell>
                      {row.amount_approved !== null
                        ? row.amount_approved.toFixed()
                        : "-"}
                    </TableCell>
                    <TableCell>{row.is_active ? <Yes /> : <No />}</TableCell>
                    <TableCell>{row.is_approved ? <Yes /> : <No />}</TableCell>
                    <TableCell>{row.is_paid ? <Yes /> : <No />}</TableCell>
                    <TableCell>
                      {new Date(Date.parse(row.date_requested)).toUTCString()}
                    </TableCell>
                    <TableCell>
                      {row.date_approved
                        ? new Date(Date.parse(row.date_approved)).toUTCString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {row.date_approved
                        ? new Date(Date.parse(row.date_paid)).toUTCString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
export default UserWithdrawals;
