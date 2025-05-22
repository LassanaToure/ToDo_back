# ToDo_back  
## TODO List Backend - Express.js

Un backend simple et complet pour créer une TODO list avec authentification sécurisée, idéal pour les débutants sur Express.js.

## Fonctionnalités

- Authentification utilisateur  
- Envoi d’email de vérification avec Nodemailer  
- Gestion sécurisée des mots de passe avec bcrypt  
- Authentification basée sur JWT  
- Stockage des données dans une base MongoDB  

## Prérequis

- Node.js (version 14 ou supérieure recommandée)  
- MongoDB (local ou service cloud comme MongoDB Atlas)  

## Installation

1. Clonez le dépôt :  
git clone https://github.com/LassanaToure/ToDo_back.git
cd ToDo_back
npm install

2.Configurez les variables d’environnement dans un fichier .env à la racine (exemple) :
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

3.Lancez le serveur en mode développement :
npm run dev
