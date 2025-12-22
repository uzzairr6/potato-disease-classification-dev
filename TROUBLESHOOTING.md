# 🛠️ Troubleshooting Guide

Common issues and solutions for the Potato Disease Classification System.

## 📋 Table of Contents

- [General Issues](#general-issues)
- [Installation Problems](#installation-problems)
- [Docker Issues](#docker-issues)
- [API Problems](#api-problems)
- [Frontend Issues](#frontend-issues)
- [Mobile App Issues](#mobile-app-issues)
- [Model Related Issues](#model-related-issues)
- [Performance Problems](#performance-problems)
- [Deployment Issues](#deployment-issues)
- [FAQ](#faq)

## 🌐 General Issues

### Application Not Starting

**Problem**: The application fails to start or crashes immediately.

**Solutions**:
1. Check all prerequisites are installed
2. Verify environment variables are set correctly
3. Ensure sufficient system resources (RAM/CPU)
4. Check for conflicting processes on required ports

### Slow Performance

**Problem**: Application responds slowly or takes too long to process images.

**Solutions**:
1. Check system resources (CPU, memory usage)
2. Verify model files are properly loaded
3. Optimize image size before upload
4. Consider using TensorFlow Lite for better performance

## 💻 Installation Problems

### Python Dependencies Fail to Install

**Problem**: `pip install -r requirements.txt` fails with errors.

**Solutions**:
```bash
# Update pip
pip install --upgrade pip

# Install build tools (Windows)
# Install Microsoft C++ Build Tools

# Install build tools (macOS)
xcode-select --install

# Install build tools (Ubuntu)
sudo apt install build-essential

# Try installing with no cache
pip install --no-cache-dir -r requirements.txt
```

### Node.js Dependencies Fail to Install

**Problem**: `npm install` fails with errors.

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Use legacy peer deps if needed
npm install --legacy-peer-deps
```

### Permission Errors

**Problem**: Installation fails due to permission issues.

**Solutions**:
```bash
# Use virtual environment (Python)
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Use npm with user flag
npm install --user

# Use sudo cautiously (Linux/macOS)
sudo npm install -g package-name
```

## 🐳 Docker Issues

### Docker Compose Fails to Start

**Problem**: `docker-compose up` fails with various errors.

**Solutions**:
```bash
# Check Docker daemon is running
docker info

# Restart Docker service
# Windows/macOS: Restart Docker Desktop
# Linux: sudo systemctl restart docker

# Check available disk space
df -h

# Rebuild images
docker-compose build --no-cache

# Reset Docker (last resort)
# Docker Desktop: Troubleshoot -> Reset to factory defaults
```

### Port Already in Use

**Problem**: Error message indicating ports are already occupied.

**Solutions**:
1. Change ports in `.env` file:
   ```bash
   API_PORT=8080
   FRONTEND_PORT=8081
   ```

2. Kill processes using the ports:
   ```bash
   # Find process using port 8000
   lsof -i :8000  # Linux/macOS
   netstat -ano | findstr :8000  # Windows

   # Kill process
   kill -9 PID  # Linux/macOS
   taskkill /PID PID /F  # Windows
   ```

### Volume Mounting Issues

**Problem**: Docker containers can't access model files.

**Solutions**:
1. Check model directory exists:
   ```bash
   ls -la saved_models/1/
   ```

2. Verify permissions:
   ```bash
   # Linux/macOS
   chmod 755 saved_models/1/
   
   # Windows: Check folder properties -> Security
   ```

3. Update docker-compose.yml if needed:
   ```yaml
   volumes:
     - ./saved_models/1:/app/saved_model:ro
   ```

### Docker Build Failures

**Problem**: `docker-compose build` fails during image creation.

**Solutions**:
```bash
# Check Dockerfile syntax
docker run --rm -v $(pwd):/app python:3.8-slim python -m py_compile /app/api/main.py

# Increase Docker resources
# Docker Desktop -> Settings -> Resources

# Clean up Docker system
docker system prune -a
```

## 🚀 API Problems

### API Not Responding

**Problem**: API endpoints return connection errors or timeouts.

**Solutions**:
1. Check if API service is running:
   ```bash
   # In Docker
   docker-compose ps
   
   # Direct run
   ps aux | grep uvicorn
   ```

2. Check API logs:
   ```bash
   docker-compose logs api
   ```

3. Test API health:
   ```bash
   curl http://localhost:8000/ping
   ```

### Model Loading Errors

**Problem**: API starts but fails to load the model.

**Solutions**:
1. Verify model files exist:
   ```bash
   ls -la saved_models/1/
   ```

2. Check model path in API code:
   ```python
   MODEL = tf.keras.models.load_model("/app/saved_model")
   ```

3. Validate model integrity:
   ```python
   import tensorflow as tf
   model = tf.keras.models.load_model("saved_models/1")
   print(model.summary())
   ```

### Prediction Failures

**Problem**: `/predict` endpoint returns errors or incorrect results.

**Solutions**:
1. Check image format and size:
   ```bash
   file your_test_image.jpg
   ```

2. Verify request format:
   ```bash
   curl -X POST -F "file=@test_image.jpg" http://localhost:8000/predict
   ```

3. Check API logs for specific error messages:
   ```bash
   docker-compose logs api | grep ERROR
   ```

### CORS Errors

**Problem**: Frontend can't communicate with API due to CORS policy.

**Solutions**:
1. Check CORS configuration in `api/main.py`:
   ```python
   origins = [
       "http://localhost",
       "http://localhost:3000",
       "http://api:8000",
   ]
   ```

2. Add your frontend URL to the origins list if needed.

## 🌐 Frontend Issues

### Frontend Not Loading

**Problem**: Web interface doesn't load or shows blank page.

**Solutions**:
1. Check if frontend service is running:
   ```bash
   docker-compose ps
   ```

2. Check frontend logs:
   ```bash
   docker-compose logs frontend
   ```

3. Verify API URL in environment variables:
   ```bash
   # Check .env file
   cat frontend/.env
   ```

### Build Errors

**Problem**: `npm run build` fails with compilation errors.

**Solutions**:
```bash
# Check for TypeScript errors
npm run lint

# Clear build cache
rm -rf frontend/dist/

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Image Upload Issues

**Problem**: Can't upload images or upload fails silently.

**Solutions**:
1. Check browser console for JavaScript errors:
   - Press F12 → Console tab

2. Verify API connectivity:
   ```javascript
   fetch('http://localhost:8000/ping')
     .then(response => console.log(response))
     .catch(error => console.error(error));
   ```

3. Check file size limits:
   - Ensure image is not too large
   - Check API configuration for file size limits

## 📱 Mobile App Issues

### App Crashes on Startup

**Problem**: Mobile app crashes immediately after launching.

**Solutions**:
1. Check logs:
   ```bash
   # Android
   adb logcat
   
   # iOS
   # Use Xcode console
   ```

2. Verify API URL in environment configuration:
   ```bash
   cat mobile-app/.env
   ```

3. Check network permissions in app configuration.

### Camera/Gallery Not Working

**Problem**: Can't access camera or select images from gallery.

**Solutions**:
1. Check permissions:
   - Ensure app has camera/gallery permissions
   - Check device settings

2. Verify react-native-image-picker installation:
   ```bash
   cd mobile-app
   npm install react-native-image-picker
   # For iOS
   cd ios && pod install && cd ..
   ```

3. Check platform-specific configuration:
   - Android: Check AndroidManifest.xml
   - iOS: Check Info.plist

### Network Errors

**Problem**: Mobile app can't connect to API.

**Solutions**:
1. Verify API is accessible from device:
   - Use device IP instead of localhost
   - Ensure same network connectivity

2. Check API URL configuration:
   ```bash
   # For emulator
   URL='http://10.0.2.2:8000/predict'
   
   # For physical device
   URL='http://YOUR_MACHINE_IP:8000/predict'
   ```

3. Check firewall settings on development machine.

## 🧠 Model Related Issues

### Incorrect Predictions

**Problem**: Model returns wrong classifications consistently.

**Solutions**:
1. Verify model file integrity:
   ```bash
   ls -la saved_models/1/
   ```

2. Test with known sample images:
   - Use images from training dataset
   - Compare with expected results

3. Check image preprocessing:
   ```python
   # Ensure consistent preprocessing
   image = np.array(Image.open(image).convert("RGB").resize((256, 256)))
   image = image/255  # Normalize to 0-1 range
   ```

### Model Not Found

**Problem**: Error indicating model files are missing.

**Solutions**:
1. Download or train a model:
   - Follow model training guide
   - Place model files in `saved_models/1/`

2. Verify model directory structure:
   ```
   saved_models/1/
   ├── saved_model.pb
   ├── keras_metadata.pb
   └── variables/
       ├── variables.data-00000-of-00001
       └── variables.index
   ```

3. Check Docker volume mounting:
   ```yaml
   volumes:
     - ./saved_models/1:/app/saved_model
   ```

### Memory Issues During Prediction

**Problem**: Out of memory errors when processing images.

**Solutions**:
1. Use TensorFlow Lite model:
   - Convert model to TFLite format
   - Use smaller model variant

2. Optimize Docker resources:
   ```yaml
   services:
     api:
       mem_limit: 2g
       mem_reservation: 1g
   ```

3. Process smaller images:
   - Reduce image size before upload
   - Optimize preprocessing pipeline

## ⚡ Performance Problems

### High CPU Usage

**Problem**: Application consumes excessive CPU resources.

**Solutions**:
1. Monitor resource usage:
   ```bash
   docker stats
   top  # or htop
   ```

2. Optimize model inference:
   - Use TensorFlow Lite
   - Implement batching
   - Cache predictions when appropriate

3. Scale horizontally:
   ```bash
   # Run multiple API instances
   docker-compose up --scale api=3
   ```

### Slow Image Processing

**Problem**: Long delays between image upload and results.

**Solutions**:
1. Check network latency:
   ```bash
   ping localhost
   ```

2. Optimize image size:
   - Compress images before upload
   - Resize on client side

3. Profile API performance:
   ```python
   import time
   start_time = time.time()
   # ... processing code ...
   end_time = time.time()
   print(f"Processing time: {end_time - start_time} seconds")
   ```

## ☁️ Deployment Issues

### GCP Deployment Failures

**Problem**: Google Cloud deployment fails or function doesn't work.

**Solutions**:
1. Check GCP project setup:
   ```bash
   gcloud config list
   gcloud projects list
   ```

2. Verify model upload to Cloud Storage:
   ```bash
   gsutil ls gs://YOUR_BUCKET_NAME/models/
   ```

3. Check deployment logs:
   ```bash
   gcloud functions logs read FUNCTION_NAME
   ```

### Environment Variable Issues

**Problem**: Application behaves differently in deployment vs. development.

**Solutions**:
1. Verify environment variables:
   ```bash
   # Docker
   cat .env
   
   # GCP
   gcloud functions describe FUNCTION_NAME
   ```

2. Use consistent configuration:
   - Maintain same environment variable names
   - Document all required variables

3. Test with production-like environment:
   ```bash
   # Use production environment file
   cp .env.production .env
   docker-compose up
   ```

## ❓ FAQ

### Q: What size should my potato leaf images be?

**A**: For best results, use images where the potato leaf fills most of the frame. The system automatically resizes images to 256x256 pixels, but starting with higher resolution images (at least 512x512) generally produces better results.

### Q: Can I use this system for other plant diseases?

**A**: The current model is specifically trained for potato diseases. To detect other plant diseases, you would need to:
1. Collect a dataset of the target plant/disease
2. Retrain the model with the new data
3. Update the class labels in the API

### Q: How accurate is the disease detection?

**A**: The model achieves approximately 95% accuracy on the validation dataset. However, real-world accuracy may vary based on:
- Image quality
- Lighting conditions
- Stage of disease progression
- Similarity to training data

### Q: Why does the mobile app need internet access?

**A**: The mobile app sends images to the API for processing because:
- The full TensorFlow model is too large for mobile devices
- Cloud processing ensures consistent performance
- Updates to the model don't require app updates

### Q: Can I run this offline?

**A**: Partial offline functionality is possible:
- Web interface: Requires API connection for predictions
- Mobile app: Requires API connection for predictions
- API: Can run locally but needs model files

For fully offline operation, you would need to:
1. Use TensorFlow Lite models
2. Implement local model loading in mobile app
3. Package models with the application

### Q: How do I update the machine learning model?

**A**: To update the model:
1. Train or obtain a new model file
2. Place in `saved_models/X/` (increment version number)
3. Update docker-compose.yml to use new version:
   ```yaml
   volumes:
     - ./saved_models/2:/app/saved_model
   ```
4. Restart services: `docker-compose down && docker-compose up`

### Q: What browsers are supported?

**A**: The web application works with modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Internet Explorer is not supported.

### Q: How much disk space do I need?

**A**: Minimum requirements:
- Application code: ~50MB
- Model files: ~100MB
- Docker images: ~1GB
- Working space: ~500MB

Total: Approximately 1.5GB, but recommend 5GB+ for development.

### Q: Can I process multiple images at once?

**A**: The current implementation processes one image at a time. For batch processing:
1. Modify the API to accept multiple files
2. Update the frontend to support multiple uploads
3. Adjust the model inference to handle batches

### Q: How do I report a bug?

**A**: To report a bug:
1. Check existing issues on GitHub
2. Include detailed information:
   - Platform (Web/Mobile/Docker)
   - Error messages
   - Steps to reproduce
   - System specifications
3. Submit through GitHub issues

### Q: How often should I retrain the model?

**A**: Model retraining frequency depends on:
- New disease variants appearing
- Changes in growing conditions
- Desired accuracy improvements
- Availability of new training data

Generally, retrain annually or when accuracy drops significantly.

### Q: Is my data stored or shared?

**A**: No personal data is stored or shared:
- Images are processed in memory only
- Not saved to disk or database
- Not transmitted to third parties
- Deleted immediately after processing

For privacy-sensitive deployments, you can:
- Run entirely offline
- Implement local storage policies
- Add encryption for data transmission

## 🆘 Need More Help?

If you're still experiencing issues after trying these solutions:

1. **Check GitHub Issues**
   - Search for similar problems
   - Create a new issue if needed

2. **Community Support**
   - Join discussion forums
   - Connect with other users

3. **Professional Support**
   - Contact development team
   - Consider commercial support options

Remember to include:
- Error messages
- System information
- Steps to reproduce
- What you've already tried