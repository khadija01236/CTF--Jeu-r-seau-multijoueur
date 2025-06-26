// controllers/gameController.js

const jwt = require("jsonwebtoken");
const flagList = require("../data/flagList");
const { fakeDB } = require("./authController"); // On importe la "fausse base de données" partagée

exports.submitFlag = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_TOKEN");
    const user = fakeDB.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const { flag } = req.body;

    const foundFlag = flagList.find((f) => f.flag === flag);
    if (!foundFlag) {
      return res.status(400).json({ message: "Flag incorrect." });
    }

    if (user.capturedFlags.includes(flag)) {
      return res.status(400).json({ message: "Flag déjà soumis." });
    }

    user.score += foundFlag.points;
    user.capturedFlags.push(flag);

    return res.json({
      message: "Flag accepté !",
      newScore: user.score,
      capturedFlags: user.capturedFlags
    });
  } catch (err) {
    return res.status(401).json({ message: "Token invalide." });
  }
};
