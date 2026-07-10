# Module Contact

Ce module gère la réception des messages depuis le formulaire de contact de la vitrine, ainsi que la notification par email (via Resend) et l'interface de gestion (Backoffice).

---

## Types TypeScript (Pour le Frontend)

Voici les interfaces recommandées pour typer les retours de l'API côté Frontend (Next.js) :

```typescript
export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export interface CreateContactRequest {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface CreateContactResponse {
  success: boolean;
  id: string;
}

export interface PaginatedContactMessages {
  data: ContactMessage[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
```

---

## Endpoints

### 1. Envoyer un message (Public)
Permet à un visiteur d'envoyer un message depuis la vitrine. Un accusé de réception est automatiquement envoyé par email à l'utilisateur, et une notification est envoyée à l'administrateur.

> ⚠️ **Attention** : Cette route est protégée par un Rate Limit (Throttler) limité à 5 requêtes toutes les 10 minutes par adresse IP pour éviter le spam.

- **Méthode** : `POST`
- **Route** : `/api/v1/contact`
- **Authentification requise** : Non

#### Body (Payload)
| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `fullName` | `string` | min 2 chars | Nom complet de l'expéditeur. |
| `email` | `string` | Email valide | Adresse email de l'expéditeur. |
| `subject` | `string` | min 3 chars | Sujet du message. |
| `message` | `string` | min 10, max 2000 chars | Contenu du message. |

Exemple :
```json
{
  "fullName": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "subject": "Demande de partenariat institutionnel",
  "message": "Bonjour, je représente l'institution XYZ et je souhaiterais vous rencontrer."
}
```

#### Réponses

✅ **Succès (201 Created)**
Retourne le succès de l'opération et l'ID du message créé.
*(L'API retourne un succès même si l'envoi d'email échoue en arrière-plan, tant que le message est sauvegardé en base).*

```json
{
  "success": true,
  "id": "cuid123456"
}
```

❌ **Erreur : Validation échouée (400 Bad Request)**
Survient lorsque les contraintes du formulaire ne sont pas respectées.

```json
{
  "message": [
    "Le nom doit contenir au moins 2 caractères",
    "L'email doit être valide",
    "Le message doit contenir au moins 10 caractères"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

❌ **Erreur : Trop de requêtes (429 Too Many Requests)**
Rate Limit atteint.

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

### 2. Lister les messages (Admin)
Permet d'afficher la liste des messages dans le backoffice, avec pagination et filtres.

- **Méthode** : `GET`
- **Route** : `/api/v1/contact`
- **Authentification requise** : Oui (Header `Authorization: Bearer <token>`)
- **Rôle requis** : `ADMIN`

#### Paramètres d'URL (Query Params)
| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | `number` | `1` | Numéro de la page. |
| `limit` | `number` | `10` | Nombre d'éléments par page. |
| `status` | `enum` | *(aucun)* | Filtrer par statut (`NEW`, `READ`, `ARCHIVED`). |

Exemple de requête : `GET /api/v1/contact?page=1&limit=10&status=NEW`

#### Réponses

✅ **Succès (200 OK)**

```json
{
  "data": [
    {
      "id": "cuid123",
      "fullName": "Jean Dupont",
      "email": "jean@example.com",
      "subject": "Partenariat",
      "message": "Bonjour...",
      "status": "NEW",
      "createdAt": "2024-03-10T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

❌ **Erreur : Non Autorisé (401 / 403)**
Token manquant/invalide, ou rôle insuffisant (ex: `EDITOR` au lieu de `ADMIN`).

---

### 3. Mettre à jour le statut d'un message (Admin)
Permet de marquer un message comme lu ou archivé.

- **Méthode** : `PATCH`
- **Route** : `/api/v1/contact/:id/status`
- **Authentification requise** : Oui (Header `Authorization: Bearer <token>`)
- **Rôle requis** : `ADMIN`

#### Body (Payload)
```json
{
  "status": "READ"
}
```

#### Réponses

✅ **Succès (200 OK)**
Retourne l'objet `ContactMessage` mis à jour.
