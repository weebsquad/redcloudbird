# redcloudbird
Simple redbird + cloudflare access verification proxy

Rename config.sample.js to config.js

# Build
docker build . -t redcloudbird

# Run
docker create redcloudbird

docker run --restart="always" -ti -p 0.0.0.0:80:8080 -e LISTEN_PORT="8080" redcloudbird

