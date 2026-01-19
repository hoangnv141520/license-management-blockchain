#!/bin/bash

echo "========================================="
echo "🔍 Hyperledger Fabric Verification Test"
echo "========================================="
echo ""

# Test 1: Check all containers
echo "📦 Test 1: Container Status"
echo "----------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "fabric-|peer|orderer|ca_" | head -10
echo ""

# Test 2: Check Fabric network
echo "🌐 Test 2: Fabric Network Status"
echo "---------------------------------"
echo "Checking peer channel membership..."
docker exec peer0.org1.example.com peer channel list 2>&1 | grep mychannel && echo "✅ Peer joined to mychannel" || echo "❌ Peer not in channel"
echo ""

# Test 3: Check chaincode
echo "📝 Test 3: Chaincode Status"
echo "---------------------------"
docker exec peer0.org1.example.com peer lifecycle chaincode queryinstalled 2>&1 | grep lisencecc && echo "✅ Chaincode installed" || echo "❌ Chaincode not installed"
echo ""

# Test 4: Backend connection
echo "🔌 Test 4: Backend Fabric Connection"
echo "------------------------------------"
docker logs fabric-backend 2>&1 | grep "Connected to Fabric network" > /dev/null && echo "✅ Backend connected to Fabric" || echo "❌ Backend not connected"
echo ""

# Test 5: Backend health
echo "💚 Test 5: Backend Health"
echo "-------------------------"
docker logs fabric-backend 2>&1 | tail -5 | grep "Server running" > /dev/null && echo "✅ Backend server running on port 8080" || echo "❌ Backend not running"
echo ""

# Test 6: MySQL connection
echo "🗄️  Test 6: Database Connection"
echo "-------------------------------"
docker logs fabric-backend 2>&1 | grep "Connected to MySQL" > /dev/null && echo "✅ Backend connected to MySQL" || echo "❌ Database connection failed"
echo ""

# Test 7: Network connectivity
echo "🌍 Test 7: Network Connectivity"
echo "-------------------------------"
docker exec fabric-backend ping -c 1 peer0.org1.example.com > /dev/null 2>&1 && echo "✅ Backend can reach Fabric peers" || echo "❌ Network connectivity issue"
echo ""

# Summary
echo "========================================="
echo "✅ VERIFICATION COMPLETE"
echo "========================================="
echo ""
echo "Access your application:"
echo "  • Frontend:    http://localhost:3000"
echo "  • Backend API: http://localhost:8080"
echo "  • phpMyAdmin:  http://localhost:8081"
echo ""
