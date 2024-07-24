#!/bin/bash

# Variables
REMOTE_USER="root"
REMOTE_HOST="5.183.8.134"
REMOTE_DIR="/opt/bracketrat/be/db/backup"
LOCAL_DIR="./backup"
SSH_KEY="/Users/nick/.ssh/id_rsa_hostinger"

# Create the local backup directory if it doesn't exist
mkdir -p $LOCAL_DIR

# Sync the remote backup directory to the local directory
rsync -avz --delete -e "ssh -i $SSH_KEY" $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/ $LOCAL_DIR/

# Print a success message
echo "Backup files from '$REMOTE_HOST:$REMOTE_DIR' have been successfully copied to '$LOCAL_DIR'."
