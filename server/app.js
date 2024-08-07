require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const router = require("./Routes/router");
const PORT = 6010;

app.get("/", (req, res) => {
  res.status(201).json("Server Started");
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("./uploads"));
app.use("/files", express.static("./public/files"));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server Started at port no ${PORT}`);
});
