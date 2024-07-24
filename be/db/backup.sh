#!/bin/bash

# Variables
DB_NAME="bracket"
OUTPUT_DIR="./backup"
MONGODB_URI="mongodb://localhost:27017"

# Create the output directory if it doesn't exist
mkdir -p $OUTPUT_DIR

# Export the database
mongodump --uri="$MONGODB_URI" --db="$DB_NAME" --out="$OUTPUT_DIR"

# Print a success message
echo "Backup of database '$DB_NAME' completed and stored in '$OUTPUT_DIR'"
