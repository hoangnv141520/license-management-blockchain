# 🧪 Blockchain API Testing Guide

## New API Endpoints

Your backend now has blockchain endpoints at: `http://localhost:8080/api/v1/blockchain`

### Available Endpoints

#### 1. Submit License to Blockchain
```bash
POST http://localhost:8080/api/v1/blockchain/license
Content-Type: application/json

{
  "id": "LICENSE_001",
  "h1Hash": "abc123hashvalue",
  "h2Hash": "def456hashvalue"
}
```

**Using curl:**
```bash
curl -X POST http://localhost:8080/api/v1/blockchain/license \
  -H "Content-Type: application/json" \
  -d '{"id":"LICENSE_001","h1Hash":"abc123hash","h2Hash":"def456hash"}'
```

#### 2. Query License from Blockchain
```bash
GET http://localhost:8080/api/v1/blockchain/license/:id
```

**Using curl:**
```bash
curl http://localhost:8080/api/v1/blockchain/license/LICENSE_001
```

#### 3. Check if License Exists
```bash
GET http://localhost:8080/api/v1/blockchain/license/:id/exists
```

**Using curl:**
```bash
curl http://localhost:8080/api/v1/blockchain/license/LICENSE_001/exists
```

#### 4. Get Full License Data
```bash
GET http://localhost:8080/api/v1/blockchain/license/:id/full
```

**Using curl:**
```bash
curl http://localhost:8080/api/v1/blockchain/license/LICENSE_001/full
```

## Complete Test Workflow

```bash
#!/bin/bash

API_URL="http://localhost:8080/api/v1/blockchain"

echo "🧪 Testing Blockchain API"
echo "========================="
echo ""

# Test 1: Submit a license
echo "1️⃣ Submitting license to blockchain..."
curl -X POST $API_URL/license \
  -H "Content-Type: application/json" \
  -d '{"id":"TEST_LICENSE_001","h1Hash":"hash1_abc123","h2Hash":"hash2_def456"}' \
  -s | jq .

echo ""
sleep 2

# Test 2: Check if it exists
echo "2️⃣ Checking if license exists..."
curl -s $API_URL/license/TEST_LICENSE_001/exists | jq .

echo ""

# Test 3: Query the license
echo "3️⃣ Querying license data..."
curl -s $API_URL/license/TEST_LICENSE_001 | jq .

echo ""

# Test 4: Get full data
echo "4️⃣ Getting full license data..."
curl -s $API_URL/license/TEST_LICENSE_001/full | jq .

echo ""
echo "✅ All tests complete!"
```

## Response Examples

### Successful Submit
```json
{
  "success": true,
  "licenseId": "LICENSE_001",
  "message": "License submitted successfully to blockchain"
}
```

### Successful Query
```json
{
  "success": true,
  "data": {
    "id": "LICENSE_001",
    "h1Hash": "abc123hash",
    "h2Hash": "def456hash"
  }
}
```

### License Exists
```json
{
  "success": true,
  "licenseId": "LICENSE_001",
  "exists": true
}
```

### License Not Found
```json
{
  "success": false,
  "message": "License LICENSE_001 not found on blockchain"
}
```

## Testing with Postman

1. **Create Collection**: "Blockchain API"
2. **Add Requests**:
   - POST Submit License
   - GET Query License  
   - GET Check Exists
   - GET Full Data

3. **Environment Variables**:
   - `BASE_URL`: http://localhost:8080
   - `LICENSE_ID`: TEST_LICENSE_001

## Integration with Frontend

```javascript
// Example JavaScript/React code

const blockchainAPI = {
  baseURL: 'http://localhost:8080/api/v1/blockchain',
  
  async submitLicense(id, h1Hash, h2Hash) {
    const response = await fetch(`${this.baseURL}/license`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, h1Hash, h2Hash })
    });
    return response.json();
  },
  
  async queryLicense(id) {
    const response = await fetch(`${this.baseURL}/license/${id}`);
    return response.json();
  },
  
  async checkExists(id) {
    const response = await fetch(`${this.baseURL}/license/${id}/exists`);
    return response.json();
  }
};

// Usage
const result = await blockchainAPI.submitLicense(
  'LICENSE_001',
  'hash1_value',
  'hash2_value'
);
console.log(result);
```

## Monitoring

### Check if endpoints are registered
```bash
docker logs fabric-backend | grep "blockchain"
```

### Watch real-time logs
```bash
docker logs -f fabric-backend
```

### Test basic connectivity
```bash
curl http://localhost:8080/api/v1/blockchain/license/TEST/exists
```

## Notes

- ✅ Endpoints are public (no authentication required for testing)
- ✅ Data is stored on Hyperledger Fabric blockchain
- ✅ Transactions are immutable once committed
- ⚠️ Add authentication for production use
