#!/bin/bash

set -e

echo "🚀 Setting up Hyperledger Fabric for License Management System"
echo "================================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to test-network
cd fabric-samples/test-network

echo -e "${YELLOW}Step 1: Cleaning up any existing network...${NC}"
./network.sh down

echo -e "${YELLOW}Step 2: Starting Fabric network with CA...${NC}"
./network.sh up createChannel -c mychannel -ca

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start network${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Network started successfully${NC}"

echo -e "${YELLOW}Step 3: Deploying chaincode...${NC}"
./network.sh deployCC \
    -ccn lisencecc \
    -ccp ../../chaincode \
    -ccl typescript

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy chaincode${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Chaincode deployed successfully${NC}"

# Go back to project root
cd ../..

echo -e "${YELLOW}Step 4: Setting up credentials for backend...${NC}"

# Copy connection profile (already exists, just verify)
if [ ! -f "backend/src/config/connection-org1.yaml" ]; then
    echo "Copying connection profile..."
    cp fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml \
       backend/src/config/connection-org1.yaml
fi

# Copy admin credentials
echo "Copying admin credentials..."
mkdir -p backend/src/config/credentials/org1-admin
cp -r fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/* \
      backend/src/config/credentials/org1-admin/

echo -e "${GREEN}✅ Credentials copied${NC}"

echo -e "${YELLOW}Step 5: Restarting backend to connect to Fabric...${NC}"
docker compose restart backend

echo ""
echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}✅ Hyperledger Fabric setup complete!${NC}"
echo -e "${GREEN}================================================================${NC}"
echo ""
echo "Network details:"
echo "  • Channel: mychannel"
echo "  • Chaincode: lisencecc"
echo "  • Organization: Org1MSP"
echo ""
echo "You can now use the blockchain features in your application!"
echo ""
echo "To check network status: docker ps | grep hyperledger"
echo "To view backend logs: docker logs -f fabric-backend"
echo ""
