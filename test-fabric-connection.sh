#!/bin/bash

echo "==== Hyperledger Fabric Connection Test ===="
echo ""

# Test network connectivity
echo "1. Testing network connectivity to peer..."
docker exec fabric-backend ping -c 1 peer0.org1.example.com > /dev/null 2>&1 && echo "✅ Can ping peer" || echo "❌ Cannot ping peer"

# Test port accessibility
echo "2. Testing port 7051 accessibility..."
docker exec fabric-backend nc -zv peer0.org1.example.com 7051 2>&1 | grep -q "open" && echo "✅ Port 7051 is open" || echo "❌ Port 7051 is not accessible"

# Check if backend is on fabric network
echo "3. Checking if backend is on fabric_test network..."
docker inspect fabric-backend --format='{{range $net,$v := .NetworkSettings.Networks}}{{$net}} {{end}}' | grep -q "fabric_test" && echo "✅ Backend is on fabric_test network" || echo "❌ Backend is NOT on fabric_test network"

# Check Fabric containers status
echo "4. Checking Fabric containers status..."
docker ps --filter "name=peer0.org1" --format "{{.Names}}: {{.Status}}"
docker ps --filter "name=orderer.example.com" --format "{{.Names}}: {{.Status}}"

# Check backend logs for Fabric connection
echo ""
echo "5. Recent backend logs:"
docker logs fabric-backend --tail=5 2>&1 | grep -E "(Fabric|Connected|Failed)"

echo ""
echo "==== Test Complete ===="
