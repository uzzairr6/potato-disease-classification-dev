# 🏗️ System Architecture

This document provides a comprehensive overview of the Potato Disease Classification System architecture, including components, data flow, and technical design decisions.

## 📐 High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐
│   Web Client    │    │  Mobile Client   │
│   (ReactJS)     │    │ (React Native)   │
└─────────┬───────┘    └────────┬─────────┘
          │                     │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   API Gateway       │
          │   (FastAPI)         │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │  Disease Prediction │
          │   (TensorFlow)      │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   Model Storage     │
          │ (TensorFlow Models) │
          └─────────────────────┘
```

## 🧩 Core Components

### 1. Frontend Applications

#### Web Application (ReactJS)
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Key Features**:
  - Responsive landing page
  - Interactive dashboard with drag-and-drop upload
  - Real-time prediction visualization
  - Recent scans history

#### Mobile Application (React Native)
- **Framework**: React Native
- **Image Handling**: react-native-image-picker
- **Networking**: Axios
- **Configuration**: react-native-config
- **Key Features**:
  - Camera integration
  - Gallery access
  - Cross-platform compatibility (iOS/Android)
  - Native performance

### 2. Backend API (FastAPI)

#### Core Technologies
- **Framework**: FastAPI
- **ASGI Server**: Uvicorn
- **Machine Learning**: TensorFlow 2.5.0
- **Image Processing**: Pillow
- **CORS**: FastAPI Middleware

#### Key Endpoints
- `GET /ping` - Health check endpoint
- `POST /predict` - Disease prediction endpoint

#### Model Loading
The API loads the TensorFlow model at startup for optimal performance:

```python
# Load model once at startup
MODEL = tf.keras.models.load_model("/app/saved_model")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
```

### 3. Machine Learning Model

#### Model Architecture
- **Type**: Convolutional Neural Network (CNN)
- **Input Size**: 256x256 RGB images
- **Output**: 3 classes with confidence scores
- **Format**: SavedModel format for TensorFlow Serving

#### Training Process
1. Data preprocessing with normalization
2. Image augmentation for robustness
3. Transfer learning with pre-trained base
4. Fine-tuning on potato disease dataset

#### Model Variants
- **Standard Model**: Full precision TensorFlow model
- **TF Lite Models**: Optimized for mobile deployment
- **Quantized Models**: Reduced size and faster inference

## 🔄 Data Flow

### 1. User Interaction Flow

```
User → [Frontend] → [API Endpoint] → [TensorFlow Model] → [Results] → User
```

### 2. Detailed Processing Steps

1. **Image Upload**
   - User selects or captures an image
   - Frontend validates file type and size
   - Image sent as multipart form data

2. **Backend Processing**
   - API receives image file
   - Converts image to numpy array
   - Resizes to 256x256 pixels
   - Normalizes pixel values to 0-1 range
   - Adds batch dimension

3. **Model Inference**
   - Preprocessed image passed to loaded model
   - Model returns prediction probabilities
   - Class with highest probability selected
   - Confidence score calculated

4. **Response Generation**
   - Results formatted as JSON
   - Sent back to frontend client
   - Displayed to user with visual indicators

## 🐳 Containerization Architecture

### Docker Services

#### API Service
```dockerfile
FROM python:3.8-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y gcc g++ && rm -rf /var/lib/apt/lists/* && pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Service
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --from-lock-json
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose Configuration

```yaml
services:
  api:
    build: ./api
    ports:
      - "${API_PORT}:8000"
    volumes:
      - ${MODEL_PATH}:/app/saved_model
    environment:
      - PYTHONPATH=/app
    networks:
      - ${DOCKER_NETWORK_NAME}

  frontend:
    build: ./frontend
    ports:
      - "${FRONTEND_PORT}:3000"
    environment:
      - VITE_API_URL=http://api:8000/predict
    depends_on:
      - api
    networks:
      - ${DOCKER_NETWORK_NAME}
```

## ☁️ Cloud Deployment Architecture

### Google Cloud Platform Deployment

#### Standard Model Deployment
- **Runtime**: Python 3.8
- **Trigger**: HTTP
- **Memory**: 512MB
- **Storage**: Google Cloud Storage for model files
- **Dependencies**: TensorFlow, Google Cloud Storage client

#### TensorFlow Lite Deployment
- **Optimized**: Smaller model size
- **Performance**: Faster inference on resource-constrained devices
- **Deployment**: Same GCP infrastructure with different model loading

## 🔧 Technical Decisions

### Why FastAPI?
- High performance with automatic API documentation
- Type hints for better code quality
- ASGI support for asynchronous operations
- Built-in validation and serialization

### Why React/React Native?
- Component-based architecture for reusable UI
- Strong ecosystem and community support
- Single codebase for web and mobile (where possible)
- Excellent developer experience with hot reloading

### Why TensorFlow?
- Industry-standard ML framework
- Excellent model deployment options
- Strong ecosystem for model optimization
- Good integration with cloud platforms

### Containerization Benefits
- Consistent environments across development and production
- Easy scaling and deployment
- Isolation of services
- Simplified dependency management

## 📊 Performance Considerations

### Model Optimization
- **Batch Processing**: Single image inference optimized for latency
- **Memory Management**: Model loaded once at startup
- **Preprocessing**: Efficient image conversion pipeline

### API Performance
- **Connection Pooling**: Reuse connections where possible
- **Caching**: Potential for caching frequent predictions
- **Asynchronous Processing**: Non-blocking I/O operations

### Frontend Optimization
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Client-side image compression
- **State Management**: Efficient React hooks usage

## 🔒 Security Considerations

### API Security
- **CORS Policy**: Restricted to known origins
- **Input Validation**: File type and size limits
- **Error Handling**: Sanitized error messages
- **Logging**: Structured logging for monitoring

### Data Privacy
- **No Data Storage**: Images not persisted on server
- **In-Memory Processing**: Temporary processing only
- **Secure Transmission**: HTTPS recommended for production

## 🔄 Scalability Architecture

### Horizontal Scaling
- **Stateless API**: Multiple instances can run behind load balancer
- **Shared Model Storage**: Model files mounted as volumes
- **Database Integration**: Future enhancement for scan history

### Vertical Scaling
- **Resource Allocation**: CPU/Memory configurable in Docker
- **Model Optimization**: TF Lite for reduced resource usage
- **Caching Layer**: Redis or similar for frequent requests

## 🛠️ Monitoring and Observability

### Logging
- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: INFO, WARNING, ERROR for different events
- **Request Tracking**: Unique identifiers for tracing

### Health Checks
- **API Health**: `/ping` endpoint for liveness probe
- **Model Status**: Verification of model loading
- **Dependency Checks**: Required services verification

### Performance Metrics
- **Response Times**: API latency tracking
- **Prediction Accuracy**: Model performance monitoring
- **Resource Usage**: CPU/Memory consumption

## 📈 Future Enhancements

### Planned Improvements
1. **Database Integration**: Persistent storage for scan history
2. **User Authentication**: Account system for personalized experience
3. **Advanced Analytics**: Trend analysis and reporting
4. **Model Updates**: Automated retraining pipeline
5. **Multi-language Support**: Internationalization

### Architecture Evolution
1. **Microservices**: Separate services for different functionalities
2. **Event-Driven**: Message queues for asynchronous processing
3. **CDN Integration**: Content delivery for static assets
4. **Serverless Options**: Function-as-a-Service for cost optimization