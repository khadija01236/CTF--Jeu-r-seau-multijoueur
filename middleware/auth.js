const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_TOKEN"); // 🔐 à sécuriser plus tard
    req.user = decoded; // on attache les infos du joueur au `req`
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = auth;
