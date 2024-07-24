#!/bin/bash

# Variables
DB_NAME="bracket"
INPUT_DIR="./backup"
MONGODB_URI="mongodb://localhost:27017"

# Check if backup directory exists
if [ ! -d "$INPUT_DIR" ]; then
  echo "Backup directory '$INPUT_DIR' does not exist. Exiting."
  exit 1
fi

# Import the database
mongorestore --uri="$MONGODB_URI" --db="$DB_NAME" "$INPUT_DIR/$DB_NAME"

# Print a success message
echo "Restoration of database '$DB_NAME' from '$INPUT_DIR' completed."
