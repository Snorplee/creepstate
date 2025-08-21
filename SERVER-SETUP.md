# Trump-Epstein Timeline Investigation - Server Setup Guide

This guide provides complete instructions for setting up an automated, secure, and monitored server deployment of the Trump-Epstein Timeline Investigation suite.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Snorplee/creepstate.git
cd creepstate

# Run full installation (requires root)
sudo ./update-server.sh install

# Check status
sudo ./update-server.sh status
```

## Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Root access or sudo privileges
- At least 2GB RAM and 10GB disk space
- Internet connection
- Optional: Domain name for SSL setup

## Features

### 🔄 Automated Updates
- Pulls latest code from repository
- Updates timeline data from external sources
- Rebuilds and redeploys Docker containers
- Creates automatic backups

### 🛡️ Security
- Firewall configuration (UFW)
- Fail2ban for intrusion detection
- SSL/TLS certificates (Let's Encrypt)
- Security monitoring and alerts

### 📊 Monitoring
- Health checks every 15 minutes
- System resource monitoring
- Application performance tracking
- Email and webhook alerts

### 🕒 Scheduling
- Daily automatic updates (2 AM)
- Continuous health monitoring
- Automatic log rotation
- Backup retention management

## Installation Steps

### 1. System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create project directory
sudo mkdir -p /opt/creepstate
cd /opt/creepstate

# Download scripts
wget https://raw.githubusercontent.com/snorplee/creepstate/main/update-server.sh
wget https://raw.githubusercontent.com/snorplee/creepstate/main/health-check.sh
chmod +x *.sh
```

### 2. Configuration

Edit the configuration variables in `update-server.sh`:

```bash
sudo nano update-server.sh
```

Update these variables:
- `GITHUB_REPO`: Your repository URL
- `NOTIFICATION_EMAIL`: Your email for alerts
- `PROJECT_DIR`: Installation directory (default: /opt/creepstate)
- `PORT`: Application port (default: 8847)

### 3. Full Installation

```bash
# Run complete installation
sudo ./update-server.sh install
```

This will:
- Install all dependencies (Docker, Nginx, etc.)
- Configure firewall and security
- Deploy the application
- Set up monitoring and automation

### 4. SSL Certificate (Optional)

If you have a domain name:

```bash
sudo ./update-server.sh ssl yourdomain.com
```

### 5. Verify Installation

```bash
# Check system status
sudo ./update-server.sh status

# Test health checks
sudo ./health-check.sh

# View logs
sudo ./update-server.sh logs
```

## Manual Operations

### Update Application

```bash
# Update code and redeploy
sudo ./update-server.sh update

# Deploy only (no code update)
sudo ./update-server.sh deploy

# Create backup
sudo ./update-server.sh backup
```

### Monitoring

```bash
# Full health check
sudo ./health-check.sh

# Check specific components
sudo ./health-check.sh container
sudo ./health-check.sh app
sudo ./health-check.sh resources

# Generate health report
sudo ./health-check.sh report email
```

### Logs and Debugging

```bash
# View application logs
sudo ./update-server.sh logs

# View Docker logs
sudo docker logs creepstate

# View system logs
sudo journalctl -u creepstate -f

# View health check logs
sudo tail -f /var/log/creepstate-health.log
```

## Systemd Service

The installation creates a systemd service for continuous monitoring:

```bash
# Check service status
sudo systemctl status creepstate

# Start/stop/restart service
sudo systemctl start creepstate
sudo systemctl stop creepstate
sudo systemctl restart creepstate

# Enable/disable auto-start
sudo systemctl enable creepstate
sudo systemctl disable creepstate
```

## Cron Jobs

Automatic scheduling is configured via cron:

```bash
# View current cron jobs
sudo crontab -l

# Edit cron jobs
sudo crontab -e
```

Default schedule:
- `0 2 * * *` - Daily update at 2 AM
- `*/15 * * * *` - Health check every 15 minutes

## Security Configuration

### Firewall Rules

```bash
# View current rules
sudo ufw status

# Allow additional ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8847/tcp  # Application
```

### Fail2ban

```bash
# Check fail2ban status
sudo fail2ban-client status

# Check SSH jail
sudo fail2ban-client status sshd

# Unban IP address
sudo fail2ban-client set sshd unbanip IP_ADDRESS
```

### SSL Certificate Management

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Backup and Recovery

### Backup Locations

- Backups: `/opt/backups/creepstate/`
- Logs: `/var/log/creepstate*.log`
- Configuration: `/opt/creepstate/`

### Restore from Backup

```bash
# Stop application
sudo docker stop creepstate

# Restore from backup
cd /opt
sudo tar -xzf /opt/backups/creepstate/backup-YYYYMMDD-HHMMSS.tar.gz

# Restart application
sudo ./creepstate/update-server.sh deploy
```

## Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check Docker status
sudo systemctl status docker

# Check container logs
sudo docker logs creepstate

# Rebuild container
sudo ./update-server.sh deploy
```

#### Application Not Responding
```bash
# Check if port is available
sudo netstat -tlnp | grep 8847

# Check firewall
sudo ufw status

# Check nginx configuration
sudo nginx -t
sudo systemctl status nginx
```

#### High Resource Usage
```bash
# Check system resources
sudo ./health-check.sh resources

# Check Docker stats
sudo docker stats

# Clean up Docker
sudo docker system prune -f
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Check nginx configuration
sudo nginx -t

# View certificate logs
sudo journalctl -u certbot
```

### Log Files

- Application logs: `/var/log/creepstate.log`
- Health check logs: `/var/log/creepstate-health.log`
- Docker logs: `sudo docker logs creepstate`
- System logs: `sudo journalctl -u creepstate`
- Nginx logs: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`

### Getting Help

1. Check logs for error messages
2. Run health checks: `sudo ./health-check.sh`
3. Verify system status: `sudo ./update-server.sh status`
4. Check Docker status: `sudo docker ps -a`
5. Review configuration files

## Advanced Configuration

### Custom Domain Setup

1. Point your domain to the server IP
2. Run SSL setup: `sudo ./update-server.sh ssl yourdomain.com`
3. Update DNS records if needed

### Performance Tuning

Edit `/opt/creepstate/docker-compose.yml`:

```yaml
services:
  creepstate:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

### Email Notifications

Install and configure postfix:

```bash
sudo apt install postfix mailutils
sudo dpkg-reconfigure postfix
```

### Webhook Notifications

Add webhook URL in `health-check.sh`:

```bash
WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
```

## Security Best Practices

1. **Regular Updates**: Keep system and Docker images updated
2. **SSH Keys**: Use SSH keys instead of passwords
3. **Firewall**: Only open necessary ports
4. **Monitoring**: Review logs regularly
5. **Backups**: Test backup restoration procedures
6. **SSL**: Always use HTTPS in production
7. **Access Control**: Limit user access and permissions

## Production Checklist

- [ ] System updated to latest versions
- [ ] Firewall configured and enabled
- [ ] Fail2ban installed and configured
- [ ] SSL certificate installed (if using domain)
- [ ] Email notifications configured
- [ ] Automatic updates scheduled
- [ ] Health monitoring active
- [ ] Backup system tested
- [ ] Documentation reviewed
- [ ] Access controls implemented

## Support

For technical issues:
1. Check this documentation
2. Review log files
3. Run diagnostic commands
4. Contact system administrator

Remember: This application handles sensitive investigative information. Ensure proper security measures are in place before exposing to the internet.