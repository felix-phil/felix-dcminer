import React, { useEffect, useCallback } from "react";
import { fetchWitdrawals } from "../../actions/withdrawalActions";
import { connect } from "react-redux";
import { Row } from "../../components/payments/WithdrawalTable";
import {
  Container,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Table,
  TablePagination,
} from "@material-ui/core";

const Naira = () => {
  return (
    <del
      style={{
        textDecorationStyle: "double",
      }}
    >
      N
    </del>
  );
};

const Withdrawals = ({ fetchWitdrawals, rows }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const fetchWith = useCallback(fetchWitdrawals, [fetchWitdrawals]);
  useEffect(() => {
    document.title = "DC Miner | Recent Withdrawal Requests";
  }, []);
  useEffect(() => {
    fetchWith();
  }, []);
  return (
    <Container maxWidth="lg" style={{ marginTop: "5%" }}>
      <React.Fragment>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>First Name</TableCell>
                <TableCell align="right">Last Name</TableCell>
                <TableCell align="right">
                  Amount Requested&nbsp;
                  <Naira />
                </TableCell>
                <TableCell align="right">
                  Amount Approved&nbsp;
                  <Naira />
                </TableCell>
                <TableCell align="right">Approve Withdrawal&nbsp;</TableCell>
                <TableCell align="right">Pay User&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row.id} row={row} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </React.Fragment>
    </Container>
  );
};
const mapStateToProps = (state) => ({
  rows: state.withdraw.withdrawals,
});

export default connect(mapStateToProps, { fetchWitdrawals })(Withdrawals);
