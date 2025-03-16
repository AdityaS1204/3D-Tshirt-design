
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dalleRoutes = require("./routes/dalle.routes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/dalle", dalleRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello from DALL.E" });
});

app.listen(3000, () => console.log(`Server has started at http://localhost:3000`));
