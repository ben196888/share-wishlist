#!/bin/bash -e
# ./push_env.sh <production | preview | development> [env_file]
while IFS== read -r name value
do
  echo "$value" | yarn vercel env add "$name" "$1"
done < "$2"
