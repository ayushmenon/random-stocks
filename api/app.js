const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");
const cors = require("cors");

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Import Routes
const stocksRoute = require("./routes/stocks");
app.use("/", stocksRoute);

//Connect to DB
mongoose.connect(process.env.DATABASE_CONNECTION, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

//Set up server
const server = app.listen(9000, () => console.log("Server started..."));

//Set up socket
const socket = require("socket.io");
const io = socket(server, {
  transports: ["websocket", "polling"],
});

require("./socket")(io);
