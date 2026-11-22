FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html admin.html style.css app.js /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
