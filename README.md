# License Management Blockchain

A web application for managing business licenses with Hyperledger Fabric blockchain integration.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript + Sequelize
- **Database**: MySQL 8.0
- **Blockchain**: Hyperledger Fabric (optional)
- **Container**: Docker Compose

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Node.js 20+](https://nodejs.org/) (for local development)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/hoangnv141520/license-management-blockchain.git
cd license-management-blockchain
```

### 2. Set Up Environment Variables

```bash
# Copy example env files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit the files and set your passwords
```

### 3. Start with Docker

```bash
docker compose up -d
```

### 4. Seed the Database

Run this once after first startup to populate required data:

```bash
docker exec fabric-backend npx ts-node src/seed.ts
```

### 5. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |
| phpMyAdmin | http://localhost:8081 |

## Development

### Local Development (with hot-reload)

The Docker setup includes hot-reloading for both frontend and backend.

```bash
# Start all services
docker compose up

# Watch logs
docker compose logs -f frontend
docker compose logs -f backend
```

### Project Structure

```
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/   # Database & Fabric config
│   │   ├── controllers/
│   │   ├── models/   # Sequelize models
│   │   ├── routes/
│   │   ├── services/
│   │   └── seed.ts   # Database seeder
│   └── .env.example
├── frontend/         # React + Vite app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
├── chaincode/        # Hyperledger Fabric chaincode
├── docker-compose.yml
└── .env.example
```

## Hyperledger Fabric Integration (Optional)

### 1. Set Up Fabric Network

```bash
# Clone fabric-samples
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples/test-network

# Start network
./network.sh up createChannel -c mychannel -ca
```

### 2. Deploy Chaincode

```bash
./network.sh deployCC -ccn lisencecc -ccp /path/to/chaincode -ccl typescript
```

### 3. Configure Backend

Copy credentials from Fabric network to `backend/config/`:
- `connection-org1.yaml` - Connection profile
- `credentials/org1-admin/` - Admin certificates

Update `backend/.env`:
```env
FABRIC_ENABLED=true
```

### 4. Restart Backend

```bash
docker compose restart backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/doanh-nghiep` | List businesses |
| POST | `/api/v1/doanh-nghiep` | Create business |
| GET | `/api/v1/ho-so` | List dossiers |
| POST | `/api/v1/ho-so` | Create dossier |
| GET | `/api/v1/giay-phep` | List licenses |
| POST | `/api/v1/giay-phep` | Create license |

## Troubleshooting

### Database Connection Error
```bash
# Check if MySQL is healthy
docker ps
docker logs fabric-mysql
```

### Frontend Not Loading
```bash
# Check frontend logs
docker logs fabric-frontend

# Restart frontend
docker compose restart frontend
```

### Seed Script Fails
```bash
# Make sure MySQL is ready
docker exec fabric-mysql mysql -u fabric_user -pfabric_password fabric_db -e "SHOW TABLES;"
```

## License

MIT
