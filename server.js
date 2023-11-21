const express = require("express");
const cors = require("cors");
const app = express();

// middleware
app.use(express.json());
app.use(cors("*"));
// app.use(express.urlencoded({ extended: true }));

// routers
const router = require("./route/userRoute.js");
app.use("/api/user", router);

// testing for api
app.get("/", (req, res) => {
  res.send({ message: "Hello from Api." });
});

// port
const PORT = process.env.PORT || 8080;

// server
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
