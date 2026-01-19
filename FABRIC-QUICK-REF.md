# Quick Reference - Hyperledger Fabric Setup

## 🎯 Quick Status Check
```bash
# Check all containers
docker ps

# Verify Fabric connection
docker logs fabric-backend --tail=5
# Should see: ✅ Connected to Fabric network
```

## 🌐 Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **phpMyAdmin**: http://localhost:8081

## ⚡ Common Commands

### Start/Stop
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart backend after changes
docker compose restart backend
```

### View Logs
```bash
docker logs -f fabric-backend
docker logs -f fabric-frontend
```

### Fabric Network
```bash
cd fabric-samples/test-network

# Stop network
./network.sh down

# Start fresh
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn lisencecc -ccp ../../chaincode -ccl typescript
```

## 📋 Key Configuration
- **Channel**: mychannel
- **Chaincode**: lisencecc v1.0
- **Organizations**: Org1MSP, Org2MSP
- **Backend connects as**: Org1MSP admin

## ✅ Success Indicators
```
✅ Connected to MySQL (via Sequelize) successfully
✅ Connected to Fabric network
🚀 Server running on http://localhost:8080
```
