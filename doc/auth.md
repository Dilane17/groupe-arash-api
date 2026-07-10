# Module Auth

Ce module gère l'authentification des administrateurs pour le Backoffice du Groupe Arash. L'API utilise une authentification basée sur JWT (JSON Web Token).

---

## Types TypeScript (Pour le Frontend)

Voici les interfaces recommandées pour typer les retours de l'API côté Frontend (Next.js) :

```typescript
export type AdminRole = 'ADMIN' | 'EDITOR';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: AdminUser;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
```

---

## Endpoints

### 1. Connexion Administrateur
Permet à un administrateur existant de se connecter et de récupérer un token d'accès.

- **Méthode** : `POST`
- **Route** : `/api/v1/auth/login`
- **Authentification requise** : Non

#### Body (Payload)
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `email` | `string` | Oui | L'adresse email de l'administrateur (doit être un email valide). |
| `password` | `string` | Oui | Le mot de passe de l'administrateur. |

Exemple :
```json
{
  "email": "admin@groupearash.com",
  "password": "password123"
}
```

#### Réponses

✅ **Succès (200 OK)**
Retourne le token JWT ainsi que les informations de l'utilisateur.

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cuid123456789",
    "email": "admin@groupearash.com",
    "name": "Administrateur Principal",
    "role": "ADMIN"
  }
}
```

❌ **Erreur : Validation échouée (400 Bad Request)**
Survient lorsque les données envoyées ne respectent pas les règles de validation (ex: email invalide, champ vide).

```json
{
  "message": [
    "L'email doit être valide",
    "Le mot de passe est requis"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

❌ **Erreur : Identifiants invalides (401 Unauthorized)**
Survient lorsque l'email n'existe pas ou que le mot de passe est incorrect.

```json
{
  "message": "Identifiants invalides",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## Informations d'Intégration (Axios / Fetch)

Une fois le `access_token` récupéré suite à un succès sur la route `/login`, le frontend **doit** l'inclure dans les en-têtes (headers) de toutes les requêtes subséquentes vers des routes protégées de l'API.

**Header requis pour les requêtes protégées :**
```http
Authorization: Bearer <votre_access_token>
```

**Comportement en cas de Token expiré ou invalide :**
Toute tentative d'accès à une route protégée sans token valide retournera une erreur `401 Unauthorized`. Côté Frontend, vous devez intercepter ce statut (via un intercepteur Axios par exemple) pour déconnecter l'utilisateur et le rediriger vers la page de login.
