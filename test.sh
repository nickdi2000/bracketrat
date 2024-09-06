#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Test the /api/v1/test endpoint
echo "Testing GET https://bracketforce.com/api/v1/test..."
response_test=$(curl --write-out "%{http_code}" --silent --output /dev/null https://bracketforce.com/api/v1/test)

if [ "$response_test" -eq 200 ]; then
  echo -e "${GREEN}GET /api/v1/test endpoint works (Status Code: 200)${NC}"
else
  echo -e "${RED}GET /api/v1/test failed (Status Code: $response_test)${NC}"
fi

# Test the /api/v1/login endpoint
echo "Testing POST https://bracketforce.com/api/v1/auth/login..."
response_login=$(curl --write-out "%{http_code}" --silent --output /dev/null -X POST https://bracketforce.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}')

if [ "$response_login" -eq 200 ]; then
  echo -e "${GREEN}POST /api/v1/auth/login successful (Status Code: 200)${NC}"
else
  echo -e "${RED}POST /api/v1/auth/login failed (Status Code: $response_login)${NC}"
fi
