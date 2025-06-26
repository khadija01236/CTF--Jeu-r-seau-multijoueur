const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Chemin du fichier où on stocke les utilisateurs
const filePath = path.join(__dirname, "../data/users.json");

// Fonction pour charger les utilisateurs depuis le fichier
const loadUsers = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Fonction pour sauvegarder les utilisateurs dans le fichier
const saveUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
};

// ✅ INSCRIPTION
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const users = loadUsers();

    const existingUser = users.find(
      (u) => u.email === email || u.username === username
    );
    if (existingUser) {
      return res.status(400).json({ message: "Email ou pseudo déjà utilisé." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: Date.now(),
      username,
      email,
      password: hashedPassword,
      score: 0,
      capturedFlags: []
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (err) {
    console.error("Erreur dans register :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ CONNEXION
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = loadUsers();

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      "SECRET_TOKEN", // Remplacer par process.env.JWT_SECRET plus tard
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score
      }
    });
  } catch (err) {
    console.error("Erreur dans login :", err.message);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};
