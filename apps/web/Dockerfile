# syntax=docker/dockerfile:1
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Serve the browser app only (no docs-src / docusaurus build pipeline)
COPY index.html ./index.html
COPY app.html ./app.html
COPY generator.html ./generator.html
COPY styles.css ./styles.css
COPY packages/core ./packages/core
COPY packages/core-ui ./packages/core-ui
COPY libs ./libs
COPY images ./images
