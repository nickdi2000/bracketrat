#!/bin/bash

# Define variables for the SSH connection and server details
SSH_KEY="/Users/nick/.ssh/id_rsa_hostinger"
SSH_USER="root"
SSH_HOST="5.183.8.134"
PROJECT_DIR="/opt/bracketrat"


# Execute the commands on the remote server via SSH
ssh -i $SSH_KEY $SSH_USER@$SSH_HOST << 'EOF'
    # Navigate to the project directory
    cd /opt/bracketrat || exit

    # Pull the latest changes from Git
    echo "Pulling latest changes from Git..."
    git reset --hard
    git pull

    # Run the build command
    echo "Building the project..."
    cd /opt/bracketrat/fe
    npm run build

    # Restart the application using PM2
    echo "Restarting the bracketrat application..."
    pm2 restart index

     echo "Deployment complete!"

    # Run the test script
    echo "Running the test script..."

    cd /opt/bracketrat
    chmod +x test.sh
    ./test.sh

    echo "Test script complete!"

   
EOF

