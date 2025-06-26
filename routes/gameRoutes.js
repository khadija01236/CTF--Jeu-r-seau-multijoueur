const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/auth");

// 🎯 Soumission d'un flag
router.post("/submit-flag", auth, (req, res) => {
  const { flag } = req.body;

  if (!flag) {
    return res.status(400).json({ message: "Le flag est requis." });
  }

  const flagsPath = path.join(__dirname, "../data/flags.json");
  const usersPath = path.join(__dirname, "../data/users.json");

  const flags = JSON.parse(fs.readFileSync(flagsPath, "utf-8"));
  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  const matchedFlag = flags.find((f) => f.value === flag);
  if (!matchedFlag) {
    return res.status(404).json({ message: "Flag invalide." });
  }

  const userIndex = users.findIndex((u) => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }

  const user = users[userIndex];

  if (user.capturedFlags.includes(matchedFlag.id)) {
    return res.status(400).json({ message: "Flag déjà capturé." });
  }

  user.capturedFlags.push(matchedFlag.id);
  user.score += matchedFlag.points;

  users[userIndex] = user;
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");

  res.json({
    message: `Flag capturé avec succès (+${matchedFlag.points} points)`,
    newScore: user.score,
    capturedFlags: user.capturedFlags
  });
});

// 🏆 Classement général (scores)
router.get("/scores", (req, res) => {
  const usersPath = path.join(__dirname, "../data/users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  const classement = users
    .map((u) => ({
      username: u.username,
      score: u.score
    }))
    .sort((a, b) => b.score - a.score);

  res.json(classement);
});

// 📜 Historique des flags capturés par l'utilisateur connecté
router.get("/history", auth, (req, res) => {
  const usersPath = path.join(__dirname, "../data/users.json");
  const flagsPath = path.join(__dirname, "../data/flags.json");

  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const flags = JSON.parse(fs.readFileSync(flagsPath, "utf-8"));

  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }

  const captured = flags.filter((f) => user.capturedFlags.includes(f.id));

  res.json({
    username: user.username,
    score: user.score,
    capturedFlags: captured
  });
});

module.exports = router;
