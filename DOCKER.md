# 🐳 Docker Deployment Guide for Potato Disease Classification

This guide explains how to deploy the Potato Disease Classification application using Docker.

For a more comprehensive understanding of the system, see:
- [Main Documentation](README.md)
- [Architecture Overview](ARCHITECTURE.md)
- [User Guides](USER_GUIDES.md)

## 📋 Prerequisites

- Docker installed on your system
- Docker Compose installed
- At least 2GB of available RAM
- Git (for cloning the repository)

## 🚀 Quick Start

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd potato-disease-classification
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file if needed (optional)
   ```

3. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000

## 🏗️ Architecture

The application consists of two main services:

### 1. API Service (`api/`)
- **Port**: 8000
- **Technology**: FastAPI with TensorFlow
- **Function**: Handles image uploads and disease prediction
- **Model**: Loads pre-trained model from `saved_models/1`

### 2. Frontend Service (`frontend/`)
- **Port**: 3000
- **Technology**: ReactJS with Tailwind CSS
- **Function**: User interface for uploading images and viewing results

## 🐳 Docker Commands

### Build Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api
docker-compose build frontend
```

### Run Services
```bash
# Run in foreground
docker-compose up

# Run in background
docker-compose up -d

# Run specific service
docker-compose up api
docker-compose up frontend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs api
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Check Service Status
```bash
# List running containers
docker-compose ps

# Check service health
docker-compose top
```

## ⚙️ Environment Variables

### API Service
- `PYTHONPATH=/app` - Python path configuration

### Frontend Service
- `VITE_API_URL=http://api:8000/predict` - API endpoint URL

### Root Configuration
The `.env` file in the root directory controls:
```bash
# API Service Configuration
API_PORT=8000
API_HOST=0.0.0.0

# Frontend Service Configuration
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:8000/predict

# Model Configuration
MODEL_PATH=./saved_models/1
MODEL_VERSION=1

# Docker Network Configuration
DOCKER_NETWORK_NAME=potato-disease-network
```

## 🛠️ Customization

### Changing Ports
Edit `docker-compose.yml` to change exposed ports:
```yaml
services:
  api:
    ports:
      - "8080:8000"  # Change external port to 8080
  
  frontend:
    ports:
      - "8081:3000"  # Change external port to 8081
```

### Using Different Model Version
Update the volume mount in `docker-compose.yml`:
```yaml
services:
  api:
    volumes:
      - ./saved_models/2:/app/saved_model  # Use version 2 model
```

### Resource Allocation
Configure CPU and memory limits:
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change ports in `docker-compose.yml`
   - Stop other services using the ports:
     ```bash
     # Find process using port 8000
     lsof -i :8000  # Linux/macOS
     netstat -ano | findstr :8000  # Windows
     ```

2. **Model not found**
   - Ensure `saved_models/1` directory exists with model files
   - Check file permissions:
     ```bash
     ls -la saved_models/1/
     ```

3. **Build failures**
   - Clear Docker cache:
     ```bash
     docker-compose build --no-cache
     ```
   - Check available disk space:
     ```bash
     df -h
     ```

4. **API connection errors**
   - Verify frontend environment variable `VITE_API_URL`
   - Check if API service is running:
     ```bash
     docker-compose ps
     ```

### Debugging

```bash
# Access API container shell
docker-compose exec api bash

# Access frontend container shell
docker-compose exec frontend bash

# Check API health
curl http://localhost:8000/ping

# Test API prediction (replace with actual image file)
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/predict
```

## 🏭 Production Deployment

For production deployment, consider:

1. **Reverse Proxy**: Use nginx for SSL termination and load balancing
2. **Monitoring**: Set up logging and monitoring with tools like Prometheus
3. **Environment-specific Configurations**: Use separate .env files for different environments
4. **Health Checks**: Implement container health checks
5. **Security**: Use secrets management for sensitive configuration
6. **Scaling**: Configure horizontal scaling with orchestration tools

### Production Docker Compose Example
```yaml
version: '3.8'
services:
  api:
    build: ./api
    ports:
      - "8000:8000"
    volumes:
      - ./saved_models/1:/app/saved_model
    environment:
      - PYTHONPATH=/app
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://api:8000/predict
    depends_on:
      - api
```

## 🛠️ Development Workflow

### Local Development with Docker
```bash
# Start development environment
docker-compose up --build

# Make code changes
# Changes will be reflected automatically (frontend hot-reloads)

# Stop and rebuild when needed
docker-compose down
docker-compose up --build
```

### Adding New Dependencies

1. **API**: Update `api/requirements.txt`
2. **Frontend**: Update `frontend/package.json`
3. **Rebuild**: `docker-compose build --no-cache`

## 📁 File Structure

```
potato-disease-classification/
├── api/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── saved_models/
│   └── 1/  # Pre-trained model
├── docker-compose.yml
├── .env.example
└── DOCKER.md
```

## 🔧 Advanced Configuration

### Multi-stage Builds
The Dockerfiles use multi-stage builds for optimization:

#### API Dockerfile
```dockerfile
# Build stage
FROM python:3.8-slim as builder
# ... build dependencies ...

# Runtime stage
FROM python:3.8-slim
# ... copy artifacts and run ...
```

#### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:16-alpine as builder
# ... build application ...

# Runtime stage
FROM node:16-alpine
# ... serve built files ...
```

### Network Configuration
Services communicate through a custom bridge network:
```yaml
networks:
  potato-disease-network:
    driver: bridge
```

### Volume Management
Persistent data storage (if needed):
```yaml
volumes:
  model-data:
    driver: local
```

## 📊 Performance Tuning

### Container Optimization
1. **Use Alpine-based images** for smaller footprint
2. **Minimize layers** in Dockerfiles
3. **Clean up** temporary files during build

### Resource Management
```yaml
services:
  api:
    # CPU allocation
    cpus: 1.0
    # Memory limits
    mem_limit: 2g
    mem_reservation: 1g
    # Restart policy
    restart: unless-stopped
```

## 🔒 Security Considerations

### Image Security
- Regularly update base images
- Scan images for vulnerabilities
- Use specific image tags instead of `latest`

### Runtime Security
```yaml
services:
  api:
    # Read-only root filesystem
    read_only: true
    # Drop unnecessary capabilities
    cap_drop:
      - ALL
    # Security options
    security_opt:
      - no-new-privileges:true
```

### Secrets Management
For sensitive data, use Docker secrets:
```yaml
services:
  api:
    secrets:
      - db_password
```

## 🆘 Support

For issues with Docker deployment:

1. **Check Docker and Docker Compose versions**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Review application logs**
   ```bash
   docker-compose logs --tail=100
   ```

3. **Verify system resources**
   ```bash
   docker info
   ```

4. **Consult Docker documentation**
   - [Docker Documentation](https://docs.docker.com/)
   - [Docker Compose Documentation](https://docs.docker.com/compose/)

For application-specific issues, see:
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Development Guide](DEVELOPMENT.md)