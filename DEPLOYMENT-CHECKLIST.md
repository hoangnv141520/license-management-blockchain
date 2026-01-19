# Production Deployment Quick Start

This is a quick reference for deploying to production. See [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md) for the full guide.

## Pre-Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set strong database passwords
- [ ] Update `ALLOW_ORIGIN` to your domain
- [ ] Update `VITE_ERM_GO_API` to your domain
- [ ] Configure firewall rules
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure Nginx reverse proxy
- [ ] Set up automatic backups

## Quick Deploy Commands

```bash
# 1. Clone repository
git clone https://github.com/your-username/license-management-blockchain.git
cd license-management-blockchain

# 2. Configure environment
cp .env.example .env
nano .env  # Edit with your production values

# 3. Set up Hyperledger Fabric
./setup-fabric.sh

# 4. Start services (development)
docker-compose up -d

# Or start with production config
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify setup
./verify-setup.sh
./test-fabric-connection.sh
```

## Production URLs

After deployment with Nginx reverse proxy and SSL:

- **Frontend**: https://yourdomain.com
- **Backend API**: https://yourdomain.com/api/v1
- **phpMyAdmin**: http://your-server-ip:8081 (localhost only)

## Important Files

- `.env` - Main environment configuration (not in git)
- `backend/.env` - Backend-specific environment (not in git)
- `.env.example` - Template for environment variables (in git)
- `docker-compose.yml` - Development compose configuration
- `docker-compose.prod.yml` - Production compose configuration
- `VPS-DEPLOYMENT-GUIDE.md` - Complete deployment documentation

## Security Notes

⚠️ **Never commit these files to git:**
- `.env`
- `backend/.env`
- `backend/wallet/`
- `backend/src/config/credentials/`
- SSL certificates

✅ **Always use:**
- Strong passwords (20+ characters)
- HTTPS in production
- Firewall rules to restrict access
- Regular backups
- Updated dependencies

## Common Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update application
git pull && docker-compose up -d --build

# Backup database
docker exec fabric-mysql mysqldump -u fabric_user -p fabric_db > backup.sql
```

## Need Help?

See the complete guide: [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md)
