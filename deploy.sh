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
npm install && npm run build

# Ensure the backend script has execute permissions
echo "Setting permissions for backend script..."
chmod +x "$CURRENT_DIR/be/src/index.js"

# Restart the bracket application using pm2
echo "Restarting bracket application..."
pm2 start "$CURRENT_DIR/be/src/index.js" --name bracket || pm2 restart bracket

echo "Deployment completed successfully."
