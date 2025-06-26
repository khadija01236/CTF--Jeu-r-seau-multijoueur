const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB(); // Connexion à MongoDB

const app = express();

const gameRoutes = require("./routes/gameRoutes");


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur Capture The Flag opérationnel !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/game", require("./routes/gameRoutes"));

app.use("/api/game", gameRoutes);