@echo off
echo Installation des dependances...
npm install

echo.
echo Generation du client Prisma...
npx prisma generate

echo.
echo Creation de la base de donnees...
npx prisma db push

echo.
echo Ajout de donnees d'exemple...
npm run db:seed

echo.
echo Setup termine! Vous pouvez maintenant lancer l'application avec:
echo npm run dev
echo.
echo Comptes de test disponibles:
echo - jean.dupont@example.com / password123
echo - marie.martin@example.com / password123
pause
