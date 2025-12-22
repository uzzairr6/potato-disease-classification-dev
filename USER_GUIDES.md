# 👥 User Guides

Comprehensive guides for using the Potato Disease Classification System on different platforms.

## 🌐 Web Application Guide

### Getting Started

1. **Access the Application**
   - Open your web browser
   - Navigate to `http://localhost:3000` (or your deployed URL)

2. **Homepage**
   - The landing page introduces the application
   - Click "Start Classifying Now" to proceed to the dashboard

### Using the Dashboard

1. **Upload an Image**
   - **Drag & Drop**: Drag a potato leaf image file onto the upload area
   - **Browse**: Click the "Select Image" button to choose a file from your device

2. **Supported Formats**
   - JPEG (.jpg, .jpeg)
   - PNG (.png)
   - Other common image formats

3. **View Results**
   - After uploading, the system automatically processes the image
   - Results appear in the "Analysis Result" section:
     - Disease classification (Early Blight, Late Blight, or Healthy)
     - Confidence score (percentage)
     - Description of the detected condition
   - The uploaded image is displayed alongside the results

4. **Recent Scans**
   - Previous scans appear in the "Recent Scans" section
   - Up to 3 recent scans are stored temporarily

### Tips for Best Results

- Use clear, well-lit photos of potato leaves
- Ensure the leaf fills most of the frame
- Avoid blurry or overly dark images
- Include a single leaf per image for best accuracy

## 📱 Mobile Application Guide

### Installation

#### Android
```bash
cd mobile-app
npm run android
```

#### iOS
```bash
cd mobile-app
npm run ios
```

### Using the Mobile App

1. **Launch the App**
   - Open the Potato Disease Prediction App on your device

2. **Capture or Select an Image**
   - **Camera**: Tap the camera icon to take a new photo
   - **Gallery**: Tap the gallery icon to select an existing image

3. **View Results**
   - The app processes the image automatically
   - Results display below the image:
     - Predicted disease class
     - Confidence percentage
   - Status messages indicate processing progress

4. **Clear Results**
   - Tap the clear icon to reset and start a new scan

### Mobile-Specific Features

- **Offline Capability**: Basic UI works offline (prediction requires connection)
- **Native Performance**: Optimized for mobile devices
- **Direct Camera Access**: No need to save photos first

## 🐳 Docker Deployment Guide

### Prerequisites
- Docker installed on your system
- Docker Compose installed
- At least 2GB of available RAM

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd potato-disease-classification
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env file if needed
   ```

3. **Build and Run**
   ```bash
   docker-compose up --build
   ```

4. **Access Applications**
   - Web Interface: `http://localhost:3000`
   - API Endpoint: `http://localhost:8000`

### Docker Commands

#### Building Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api
docker-compose build frontend
```

#### Running Services
```bash
# Run in foreground
docker-compose up

# Run in background
docker-compose up -d

# Run specific service
docker-compose up api
```

#### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

#### Viewing Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs api

# Follow logs in real-time
docker-compose logs -f
```

### Customization

#### Changing Ports
Edit `docker-compose.yml`:
```yaml
services:
  api:
    ports:
      - "8080:8000"  # External:Internal
      
  frontend:
    ports:
      - "8081:3000"
```

#### Using Different Model Versions
Update volume mount in `docker-compose.yml`:
```yaml
services:
  api:
    volumes:
      - ./saved_models/2:/app/saved_model  # Use version 2
```

## ☁️ Cloud Deployment Guide

### Google Cloud Platform Deployment

#### Prerequisites
1. GCP account
2. Project created in GCP Console
3. Google Cloud SDK installed and authenticated
4. GCP bucket for model storage

#### Deployment Steps

1. **Prepare Model**
   - Upload the `.h5` model to your GCP bucket
   - Path: `models/potatoes.h5`

2. **Authenticate with GCP**
   ```bash
   gcloud auth login
   ```

3. **Deploy to Cloud Functions**
   ```bash
   cd gcp
   gcloud functions deploy predict --runtime python38 --trigger-http --memory 512 --project YOUR_PROJECT_ID
   ```

4. **Test Deployment**
   - Use the Trigger URL provided by GCP
   - Test with Postman or cURL

### TensorFlow Lite Deployment

For optimized mobile deployment:

1. **Convert Model to TF Lite**
   - Use the provided Jupyter notebooks in `training/`
   - Save to `tf-lite-models/`

2. **Deploy Lite Model**
   ```bash
   gcloud functions deploy predict_lite --runtime python38 --trigger-http --memory 512 --project YOUR_PROJECT_ID
   ```

## ⚙️ Configuration Guides

### Environment Variables

#### Root Directory (.env)
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
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://0.0.0.0:8000/predict
```

#### Mobile App (.env)
```bash
URL='http://0.0.0.0:8000/predict'
```

### API Configuration

#### Using TensorFlow Serving
1. Copy `models.config.example` to `models.config`
2. Update paths in the config file
3. Run TensorFlow Serving:
   ```bash
   docker run -t --rm -p 8501:8501 \
     -v $(pwd):/potato-disease-classification \
     tensorflow/serving \
     --rest_api_port=8501 \
     --model_config_file=/potato-disease-classification/models.config
   ```

## 🎯 Advanced Usage

### Batch Processing
While the current implementation processes one image at a time, you can extend it for batch processing:

1. Modify the API to accept multiple files
2. Update the frontend to support multiple uploads
3. Adjust the model inference to handle batches

### Custom Model Integration
To use a different model:

1. Replace files in `saved_models/1/`
2. Update `CLASS_NAMES` in `api/main.py` if needed
3. Restart the API service

### Integration with Other Systems
The API can be integrated with:

1. **Agricultural Management Systems**
2. **Mobile Apps with Custom UI**
3. **Automated Greenhouse Systems**
4. **Research Data Collection Platforms**

## 📊 Interpreting Results

### Confidence Scores
- **90-100%**: Very high confidence
- **70-89%**: High confidence
- **50-69%**: Moderate confidence
- **Below 50%**: Low confidence, consider retaking image

### Disease Descriptions

#### Early Blight
- Caused by fungus Alternaria solani
- Small, dark lesions on lower leaves
- Concentric rings in lesion centers
- Yellowing around lesions

#### Late Blight
- Caused by water mold Phytophthora infestans
- Water-soaked lesions on leaves
- White fungal growth on leaf undersides
- Rapid spread in cool, wet conditions

#### Healthy
- No visible signs of disease
- Normal green coloration
- No spots, lesions, or discoloration

## 📱 Mobile App Features

### Camera Integration
- Direct photo capture without leaving app
- Automatic image processing
- Real-time feedback during capture

### Gallery Access
- Select existing photos from device
- Preview before processing
- Support for recent photos

### Performance Optimization
- TensorFlow Lite for faster inference
- Reduced memory footprint
- Battery-efficient processing

## 🌐 Web App Features

### Responsive Design
- Works on desktop, tablet, and mobile browsers
- Adaptive layout for different screen sizes
- Touch-friendly interface

### User Experience
- Drag-and-drop file upload
- Visual feedback during processing
- Clear result presentation

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode

## 🔧 Troubleshooting Common Issues

### Image Upload Problems
1. **File Size**: Ensure image is not too large
2. **Format**: Use supported image formats (JPEG, PNG)
3. **Quality**: Use clear, focused images

### Connection Errors
1. **API Status**: Check if API service is running
2. **Network**: Verify internet connectivity
3. **CORS**: Ensure proper origin configuration

### Performance Issues
1. **Hardware**: Ensure sufficient CPU/memory
2. **Model**: Consider using TF Lite for better performance
3. **Network**: Optimize connection speed

## 🆘 Getting Help

### Community Support
- Check GitHub issues for known problems
- Search documentation for solutions
- Join community forums

### Reporting Issues
When reporting problems, include:
1. Platform (Web/Mobile/Docker)
2. Error messages
3. Steps to reproduce
4. System specifications

### Feature Requests
Submit feature requests through:
- GitHub issues
- Community forums
- Direct contact channels