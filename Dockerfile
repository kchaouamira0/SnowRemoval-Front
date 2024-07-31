# Étape 1: Utiliser une image de base avec Node.js
FROM node:17-alpine as build-step

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application Angular pour la production
RUN npm run build

### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:latest AS ngi
# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder 

COPY --from=build-step /app/dist /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running
EXPOSE 80
