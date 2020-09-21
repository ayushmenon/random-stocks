import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

//Set up socket
import Socket from "socket.io-client";
const socket = Socket("http://localhost:9000", {
  transports: ["websocket", "polling"],
});

//Styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#21ce99",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({});

//Component function
export default function SimpleTable() {
  const classes = useStyles();

  const [stocks, setStocks] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    socket.on("stock data", (data) => {
      setStocks(data);
      setHistoricalData((currentData) => [...currentData, data[0]]);
    });
  }, []);

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="center">Ticker</StyledTableCell>
              <StyledTableCell align="center">Price</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {stocks.map((stock) => {
              return (
                <StyledTableRow key={stock.name}>
                  <StyledTableCell component="th" scope="row">
                    {stock.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {stock.ticker}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {stock.price.toFixed(2)}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <LineChart
        width={700}
        height={350}
        data={historicalData}
        margin={{ top: 50, right: 30, left: 0, bottom: 5 }}
      >
        <XAxis />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line dataKey="price" />
      </LineChart>
      <h2>
        <span role="img" aria-label="pointer">
          👈
        </span>
        Tesla{" "}
      </h2>
    </Grid>
  );
}
