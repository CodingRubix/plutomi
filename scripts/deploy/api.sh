#!/bin/bash

# Default to 'staging' if no argument is provided
DEPLOYMENT_ENVIRONMENT="${1:-staging}"

# Navigate to the API directory
cd packages/api

# If the default 'staging' is used, notify the user in red letters
if [ "$DEPLOYMENT_ENVIRONMENT" == "staging" ]; then
  for i in {1..3}; do
    echo -e "\n\n-- No environment specified, defaulting to 'staging' --\n\n"
    sleep 2
    done
fi

# Generate the fly.toml file from the template
sed "s/{{ENV}}/$DEPLOYMENT_ENVIRONMENT/g" fly.template.toml > fly.toml


echo -e "\n\n-- DEPLOYING '$DEPLOYMENT_ENVIRONMENT' ON FLY.IO --\n\n"
sleep 5

# Now deploy using the generated fly.toml
fly deploy
