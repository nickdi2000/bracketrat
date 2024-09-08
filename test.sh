#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color


# test if mongodb is running (service mongod status)
echo "Testing if MongoDB is running..."
if service mongod status | grep -q "active (running)"; then
  echo -e "${GREEN}MongoDB is running${NC}"
else
  echo -e "${RED}MongoDB is not running${NC}"
fi

# test if pm2 'bracket' process is running (pm2 list)
echo "Testing if the 'bracket' process is running..."
if pm2 list | grep -q "bracket"; then
  echo -e "${GREEN}'bracket' process is running${NC}"
else
  echo -e "${RED}'bracket' process is not running${NC}"
fi


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


