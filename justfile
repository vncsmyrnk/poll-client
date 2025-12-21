default:
  @just list

build-and-run-image:
  docker build -t poll-client .
  docker compose up -d
  docker run -it --rm \
    --network host \
    -p 80:80 \
    -e API_BASE_URL='https://poll-api.vncsmyrnk.dev/api' \
    poll-client
