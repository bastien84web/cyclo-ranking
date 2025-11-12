# Configuration de la base de données

## 🐘 PostgreSQL Local avec Docker

### Installation

1. **Installer Docker Desktop** : https://www.docker.com/products/docker-desktop/

2. **Démarrer PostgreSQL** :
   ```bash
   docker-compose up -d
   ```

3. **Vérifier que c'est démarré** :
   ```bash
   docker ps
   ```

4. **Créer les tables** :
   ```bash
   npx prisma db push
   ```

5. **Peupler la base** :
   ```bash
   npm run db:complete-cyclosportives-2025
   ```

### Commandes utiles

- **Démarrer la BDD** : `docker-compose up -d`
- **Arrêter la BDD** : `docker-compose down`
- **Voir les logs** : `docker-compose logs -f`
- **Réinitialiser** : `docker-compose down -v` (supprime toutes les données)

### Accès à la base

- **Host** : localhost
- **Port** : 5432
- **Database** : cycloranking
- **User** : cycloranking
- **Password** : password123

### GUI pour visualiser les données

- **Prisma Studio** : `npx prisma studio` (recommandé)
- **pgAdmin** : https://www.pgadmin.org/
- **DBeaver** : https://dbeaver.io/

---

## 📊 Environnements

| Environnement | Base de données | URL |
|---------------|----------------|-----|
| **Local** | PostgreSQL (Docker) | `postgresql://cycloranking:password123@localhost:5432/cycloranking` |
| **Production** | PostgreSQL (Supabase) | `postgresql://postgres.xxx@aws-xxx.supabase.com:6543/postgres` |

---

## 🔄 Migration depuis SQLite

Si vous aviez SQLite (`dev.db`), vos données sont dans `prisma/dev.db`. Pour migrer :

1. Démarrez PostgreSQL avec Docker
2. Lancez `npx prisma db push`
3. Re-peuplez avec `npm run db:complete-cyclosportives-2025`

Les anciennes données SQLite restent dans `dev.db` (vous pouvez les garder en backup).
