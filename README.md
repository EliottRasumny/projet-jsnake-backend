# Création d’une RESTful API pour une pizzeria : Step 8 – Sauvegarde du username et du token au sein d’un cookie côté client

## Introduction
- Lors de la création d'une SPA, afin de gérer les données de session côté client, il y a deux principales possibilités :
    - Sauvegarde de ces données dans le Web Storage du browser ; dans ce cas particulier, l'API ne doit rien faire de spécifique, elle renvoie simplement le token au client qui se charge de le sauvegarder.
    - Sauvegarde de ces données dans un cookie ; dans ce cas-ci, l'API est en charge de préparer ce cookie, d'y inclure le token, et de le renvoyer au client. Le client ne doit rien faire de particulier, car par défaut, le browser sauve le cookie et envoie automatiquement les cookies pour chaque requête vers un domaine.
- Nous allons ici voir comment inclure les données de session côté client, pour cette application ça sera un username et un token JWT, au sein d'un cookie préparé par la RESTful API.
## How to ? Création du cookie
- Installation de la libraire `cookie-session` : `npm i cookie-session`
- Utilisation et configuration des cookies : 
    - Protection contre les attaques XSS : utilisation de `HttpOnly` pour rendre les cookies inaccessible au JS
    - Configuration des cookies dans /app.js :
    ```js
    var cookieSession = require("cookie-session");
    var app = express();
    let expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1h;
    app.use(
        cookieSession({
            name: "user",
            keys: ["689HiHoveryDi79*"],cookie: {
                httpOnly: true,
                expires: expiryDate,
                },
            })
        );
     ```
    - Création des données de session (qui seront inclues dans le cookies et sauvegardées par le client) au sein de `/routes/auths.js` :
    ```js
    req.session.username = authenticatedUser.username;
    ```
    - Lecture des données de session : voir `authorizeFromCookie` dans `/utils/authorize.js` : 
    ```js
    req.session.username = authenticatedUser.username;
    ```
    
# Conclusion
- Cette RESTful API permet de gérer les données de session côté client (le username et le token pour cette application) au sein de cookies.
- Il est à noter qu'il existe aussi la possibilité de sauvegarder les données de session de session côté serveur. Cette approche n'est pas vue dans ce cours, car elle amène à une scalabilité horizontale plus difficile d'une API : l'augmentation du nombre de serveurs pour répondre à une charge plus élevée amène à complexifier l'application. 
De plus, les applications clientes sont de plus en plus puissante et donc il est de plus en plus intéressant de s'appuyer sur les ressources des clients plutôt que de devoir gérer des serveurs surpuissants (et couteux).