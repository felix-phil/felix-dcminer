import React from "react";
import Nodata from "../../assets/images/nodata.png";
import Paper from "@material-ui/core/Paper";
const NoData = () => {
  return (
    // <center>
    <Paper
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <img src={Nodata} alt="No data found" />
    </Paper>
    // </center>
  );
};

export default NoData;
