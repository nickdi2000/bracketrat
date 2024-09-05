#!/bin/bash

# Store the current directory
CURRENT_DIR=$(pwd)

# Run npm run build in the fe folder
echo "Building frontend..."
cd "$CURRENT_DIR/fe"
npm install && npm run build

# Run npm run build in the be folder
echo "Building backend..."
cd "$CURRENT_DIR/be"
npm install && pm2 restart bracket

# do a curl command to https://bracketforce.com/api/v1/test
echo "Testing deployment..."
curl https://bracketforce.com/api/v1/test

echo "Curl finished."



echo "Bracket Deployment completed successfully."
