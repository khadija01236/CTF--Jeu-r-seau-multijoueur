const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

// 📌 Route POST : Inscription
router.post("/register", register);

// 📌 Route POST : Connexion
router.post("/login", login);

// 📌 Route GET : Profil du joueur connecté (protégé)
router.get("/me", auth, (req, res) => {
  const filePath = path.join(__dirname, "../data/users.json");
  const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const currentUser = users.find((u) => u.id === req.user.id);

  if (!currentUser) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }

  res.json({
    id: currentUser.id,
    username: currentUser.username,
    email: currentUser.email,
    score: currentUser.score,
    capturedFlags: currentUser.capturedFlags
  });
});

module.exports = router;
