FROM node:12.18 AS builder
ENV NODE_ENV production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --save @angular/core
# RUN npm install --save bootstrap
# RUN npm install --save @angular/animations 
RUN npm install -g @angular/cli@latest
RUN npm install 
COPY . .
EXPOSE 4200

CMD npm run start

# FROM node:10.13 AS builder
# ENV NODE_ENV production

# WORKDIR /app
# COPY  ["Frontend/package.json", "Frontend/package-lock.json*", "Frontend/npm-shrinkwrap.json*", "Frontend/"]
# RUN npm install -g @angular/cli@latest
# COPY . .
# WORKDIR /app/Frontend
# RUN npm install
# RUN npm run build

# FROM nginx:1.19.1-alpine as prod-stage 
# COPY Frontend/nginx.conf /etc/nginx/nginx.conf
# COPY --from=builder /app/Frontend/dist/frontend /usr/share/nginx/html/
# EXPOSE 4200
# CMD ["nginx","-g","daemon off;"]
# # RUN ls -la