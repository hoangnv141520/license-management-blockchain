#!/bin/bash

echo "Testing Blockchain Functions"
echo "================================"
echo ""

# Test 1: Submit a test license
echo "Submitting test license..."
docker exec peer0.org1.example.com peer chaincode invoke \
  -C mychannel -n lisencecc \
  -c '{"function":"SubmitLisence","Args":["TEST_001","abc123hash","def456hash"]}' \
  --waitForEvent 2>&1 | grep -v "Warning:"

sleep 2

# Test 2: Query the license
echo ""
echo "Querying test license..."
RESULT=$(docker exec peer0.org1.example.com peer chaincode query \
  -C mychannel -n lisencecc \
  -c '{"function":"QueryLisence","Args":["TEST_001"]}' 2>&1 | grep -v "Warning:")

echo "$RESULT"

# Test 3: Check if exists
echo ""
echo "Checking if license exists..."
EXISTS=$(docker exec peer0.org1.example.com peer chaincode query \
  -C mychannel -n lisencecc \
  -c '{"function":"AssetExists","Args":["TEST_001"]}' 2>&1 | grep -v "Warning:")

echo "Result: $EXISTS"

echo ""
echo "================================"
echo "Tests complete!"
echo ""
echo "Summary:"
echo "  - Submitted license: TEST_001"
echo "  - License data: $RESULT"
echo "  - Exists: $EXISTS"
