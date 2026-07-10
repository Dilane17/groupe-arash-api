# Documentation de l'API - Groupe Arash

Ce dossier contient la documentation technique détaillée pour chaque module de l'API `groupe-arash-api`. Le but de cette documentation est de faciliter et de standardiser l'intégration de l'API avec le backoffice et la vitrine (développés en Next.js).

> **Règle d'or :** À chaque fois qu'un nouveau module est développé (ex: JobOffers, NewsArticles, Partners...), sa documentation **doit obligatoirement** être créée ici sous la forme `nom-du-module.md` avant d'être considérée comme terminée.

## Modules documentés :

- [Authentification (Admin)](./auth.md)
- [Contact (Formulaire & Email)](./contact.md)
- [Carrières (Offres & Candidatures)](./careers.md)
- [Actualités (News & Médias)](./news.md)
- [Partenaires (Logos)](./partners.md)
- [Médiathèque (Photos, Vidéos, Docs)](./media.md)

## Standards de l'API

### URL de base
Toutes les routes de cette API sont préfixées par :
`/api/v1`

### Format des Réponses d'Erreurs
L'API utilise le système de validation de NestJS (ValidationPipe). Par défaut, toute erreur de requête retournera le format suivant :

```json
{
  "message": "Message d'erreur spécifique ou tableau de messages",
  "error": "Nom de l'erreur HTTP (ex: Bad Request)",
  "statusCode": 400
}
```

### Types et Interfaces Frontend
Dans la documentation de chaque module, vous trouverez un encart **Types TypeScript** à copier-coller ou adapter côté Frontend. Cela garantit que le typage (TypeScript) est identique entre le back et le front.

### Sécurité & CORS
- L'API est protégée contre le vol d'informations par **Helmet**.
- L'API n'accepte les requêtes CORS que depuis l'origine définie dans la variable d'environnement `FRONTEND_URL` (le nom de domaine du site).
- Toute route protégée nécessitera l'envoi d'un header `Authorization: Bearer <token>`.
