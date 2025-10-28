#!/bin/bash

echo "Installation des dépendances..."
npm install

echo ""
echo "Génération du client Prisma..."
npx prisma generate

echo ""
echo "Création de la base de données..."
npx prisma db push

echo ""
echo "Ajout de données d'exemple..."
npm run db:seed

echo ""
echo "Setup terminé! Vous pouvez maintenant lancer l'application avec:"
echo "npm run dev"
echo ""
echo "Comptes de test disponibles:"
echo "- jean.dupont@example.com / password123"
echo "- marie.martin@example.com / password123"
