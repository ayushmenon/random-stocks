const Stock = require("./models/Stock");

// Randomize and Emit Prices
async function randomizePricesAndEmit(socket) {
  try {
    await Stock.randomize();
    const stocks = await Stock.find();
    socket.emit("stock data", stocks);
  } catch (err) {
    console.log(err);
  }
}

// Retrieve and Emit Prices Upon Connection
async function getAndEmit(socket) {
  try {
    const stocks = await Stock.find();
    socket.emit("stock data", stocks);
  } catch (err) {}
}

//Socket Logic
let interval;

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("a user connected");
    getAndEmit(socket)
      .then(() => {
        if (interval) {
          clearInterval(interval);
        }
        interval = setInterval(() => randomizePricesAndEmit(socket), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
    socket.on("disconnect", () => {
      console.log("user disconnected");
      clearInterval(interval);
    });
  });
};
