#!/bin/sh

# If API_BASE_URL is provided, replace the value in the config file
if [ ! -z "$API_BASE_URL" ]; then
  # Matches: API_BASE_URL: "anything"
  # Replaces with: API_BASE_URL: "$API_BASE_URL"
  sed -i "s|API_BASE_URL: ".*"|API_BASE_URL: \"$API_BASE_URL\"|g" /usr/share/nginx/html/env-config.js
fi

exec "$@"
