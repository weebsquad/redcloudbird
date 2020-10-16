# redcloudbird
Simple redbird + cloudflare access verification proxy

Rename config.sample.js to config.js

# Build
docker build . -t masterproxy

# Run
docker create masterproxy
docker run --restart="always" -ti -p <bindip>:80:8080 -e LISTEN_PORT="8080" masterproxy

