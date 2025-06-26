# 🎯 Capture The Flag – Backend

Ce projet simule une compétition de type **Capture The Flag**, dans laquelle les joueurs doivent exploiter des failles simulées pour capturer des "drapeaux" numériques (flags).  
Le backend est développé en **Node.js** avec un stockage local en `JSON` pour tester rapidement sans base de données externe.

---

## 🚀 Fonctionnalités backend disponibles

### 🔐 Authentification des joueurs
- [x] **Inscription** (`POST /api/auth/register`)  
- [x] **Connexion** (`POST /api/auth/login`)  
- [x] **Token JWT** généré à la connexion  
- [x] **Middleware d’authentification** (`auth.js`)  
- [x] **Profil joueur** (`GET /api/auth/me`) – Protégé

### 🗃️ Stockage persistant
- [x] Les joueurs sont sauvegardés dans un fichier `data/users.json`  
- [x] Le backend fonctionne même sans MongoDB

---

## 🔧 Fonctionnalités restantes à développer

### 🎮 Logique du jeu
- [ ] **Lancer une session de jeu** (`GET /api/game/start`) – simulation ou sélection de machine
- [ ] **Soumettre un flag** (`POST /api/game/submit-flag`)
  - Vérifie que le flag est valide
  - Vérifie que le joueur ne l’a pas déjà soumis
  - Ajoute des points au score
- [ ] **Voir l'historique de jeu** (`GET /api/game/history`) – optionnel

### 🏁 Gestion des flags
- [ ] Créer un fichier `data/flags.json` avec les flags valides
- [ ] Associer chaque flag à une machine cible et un nombre de points

### 📊 Classement
- [ ] **Classement général** (`GET /api/scores`) – liste des joueurs triés par score

---

## 📦 Technologies utilisées

- **Node.js** / **Express**
- **bcryptjs** – pour le hachage des mots de passe
- **jsonwebtoken (JWT)** – pour les tokens d’authentification
- **fs** / **JSON** – pour simuler une base de données sans MongoDB


