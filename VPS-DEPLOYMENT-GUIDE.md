# VPS Deployment Guide

This guide walks you through deploying the License Management Blockchain application on a VPS (Virtual Private Server).

## Prerequisites

- Ubuntu 20.04 LTS or later
- Minimum 4GB RAM (8GB+ recommended for Hyperledger Fabric)
- Minimum 40GB disk space
- Root or sudo access
- A domain name (optional but recommended)

---

## Initial Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
```

### 3. Install Git & Node.js

```bash
# Install Git
sudo apt install git -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Configure Firewall

```bash
# Allow SSH (IMPORTANT: do this first!)
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application ports
sudo ufw allow 3000/tcp  # Frontend (or use Nginx reverse proxy)
sudo ufw allow 8080/tcp  # Backend API (or use Nginx reverse proxy)

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## Application Deployment

### 1. Clone Repository

```bash
# Navigate to home directory or /var/www
cd ~
# Or: cd /var/www

# Clone your repository
git clone https://github.com/your-username/license-management-blockchain.git
cd license-management-blockchain
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with production values
nano .env
```

**Important `.env` configurations for production:**

```bash
# MySQL - Use strong passwords!
MYSQL_DATABASE=fabric_db
MYSQL_USER=fabric_user
MYSQL_PASSWORD=YOUR_STRONG_PASSWORD_HERE
MYSQL_ROOT_PASSWORD=YOUR_STRONG_ROOT_PASSWORD_HERE
MYSQL_PORT_HOST=3307

# Backend
SERVER_PORT=8080
DB_HOST=mysql
DB_PORT=3306
DB_NAME=fabric_db
DB_USER=fabric_user
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE

# IMPORTANT: Change to your actual domain or VPS IP
ALLOW_ORIGIN=https://yourdomain.com

# Frontend
FRONTEND_PORT=3000
# Change to your actual domain or VPS IP
VITE_ERM_GO_API=https://yourdomain.com/api/v1

# phpMyAdmin
PHPMYADMIN_PORT=8081

# Fabric settings
FABRIC_ENABLED=true
FABRIC_CHANNEL=mychannel
FABRIC_CHAINCODE=lisencecc
```

Also configure backend-specific environment:

```bash
# Edit backend .env
nano backend/.env
```

Make sure it matches your root `.env` settings.

### 3. Set Up Hyperledger Fabric Network

```bash
# Run the fabric setup script
chmod +x setup-fabric.sh
./setup-fabric.sh
```

Wait for the Fabric network to fully initialize. This may take several minutes.

### 4. Start Application Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Verify Setup

```bash
# Run verification script
chmod +x verify-setup.sh
./verify-setup.sh

# Test blockchain connection
chmod +x test-fabric-connection.sh
./test-fabric-connection.sh
```

---

## Production Optimizations

### 1. Set Up Nginx Reverse Proxy (Recommended)

Install Nginx:

```bash
sudo apt install nginx -y
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/license-management
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/license-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL is configured, update your `.env` files to use HTTPS URLs.

### 3. Create Production Docker Compose

Create a production-specific compose file:

```bash
cp docker-compose.yml docker-compose.prod.yml
nano docker-compose.prod.yml
```

Update build targets to `production` and remove development volumes.

### 4. Set Up Auto-Start on Reboot

```bash
# Create systemd service
sudo nano /etc/systemd/system/license-management.service
```

Add this content:

```ini
[Unit]
Description=License Management Blockchain
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/yourusername/license-management-blockchain
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable the service:

```bash
sudo systemctl enable license-management.service
sudo systemctl start license-management.service
```

---

## Database Management

### Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup MySQL database
docker exec fabric-mysql mysqldump -u fabric_user -p fabric_db > ~/backups/fabric_db_$(date +%Y%m%d).sql
```

### Restore Database

```bash
docker exec -i fabric-mysql mysql -u fabric_user -p fabric_db < ~/backups/fabric_db_YYYYMMDD.sql
```

### Schedule Automatic Backups

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * docker exec fabric-mysql mysqldump -u fabric_user -pfabric_password fabric_db > ~/backups/fabric_db_$(date +\%Y\%m\%d).sql
```

---

## Monitoring & Maintenance

### View Application Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Check Resource Usage

```bash
# Docker stats
docker stats

# System resources
htop  # Install with: sudo apt install htop
```

### Update Application

```bash
# Pull latest code
cd ~/license-management-blockchain
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verify
docker-compose ps
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

---

## Security Best Practices

### 1. Strong Passwords
- Use strong, unique passwords for all services
- Never use default passwords in production
- Consider using a password manager

### 2. Regular Updates
```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### 3. Secure Database Access
- Don't expose MySQL port (3307) to the internet
- Use strong passwords
- Consider using MySQL over TLS

### 4. Firewall Configuration
- Only allow necessary ports
- Use fail2ban to prevent brute force attacks:

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 5. Backup Fabric Credentials
```bash
# Backup Fabric wallet and certificates
tar -czf ~/backups/fabric-credentials-$(date +%Y%m%d).tar.gz \
  backend/wallet/ \
  backend/src/config/credentials/
```

---

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h
```

### Database Connection Issues

```bash
# Verify MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Test connection
docker exec -it fabric-mysql mysql -u fabric_user -p
```

### Fabric Network Issues

```bash
# Check Fabric network
docker network ls | grep fabric

# Restart Fabric network
cd fabric-samples/test-network
./network.sh down
./network.sh up createChannel -c mychannel
./network.sh deployCC -ccn lisencecc -ccp ../../chaincode -ccl javascript
```

### Port Conflicts

```bash
# Check what's using a port
sudo lsof -i :8080
sudo netstat -tulpn | grep 8080
```

---

## Performance Tuning

### Increase Docker Resources

Edit Docker daemon configuration:

```bash
sudo nano /etc/docker/daemon.json
```

Add:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

### Optimize MySQL

```bash
# Edit MySQL configuration
docker exec -it fabric-mysql bash
nano /etc/mysql/my.cnf
```

Add MySQL optimizations based on your server resources.

---

## Access Your Application

- **Frontend**: http://your-vps-ip:3000 (or https://yourdomain.com with Nginx)
- **Backend API**: http://your-vps-ip:8080/api/v1
- **phpMyAdmin**: http://your-vps-ip:8081

---

## Support & Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## Quick Reference Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Update application
git pull && docker-compose up -d --build

# Backup database
docker exec fabric-mysql mysqldump -u fabric_user -p fabric_db > backup.sql

# Check disk usage
df -h

# Check Docker disk usage
docker system df
```
