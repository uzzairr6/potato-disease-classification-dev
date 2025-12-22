# 📡 API Documentation

Complete documentation for the Potato Disease Classification RESTful API.

## 📋 Overview

The API provides endpoints for health checking and disease prediction. It's built with FastAPI, which automatically generates interactive API documentation.

### Base URL
```
http://localhost:8000
```

### Authentication
No authentication required for basic usage.

## 🚦 Health Check Endpoint

### GET `/ping`

Health check endpoint to verify that the API is running.

**Response:**
```json
"Hello, I am alive"
```

**Example:**
```bash
curl http://localhost:8000/ping
```

## 🔍 Prediction Endpoint

### POST `/predict`

Upload an image of a potato leaf to classify its disease.

**Request:**
- **Method**: POST
- **Content-Type**: multipart/form-data
- **File Parameter**: `file` (image file)

**Supported Formats:**
- JPEG
- PNG
- Other common image formats

**Size Limits:**
- Maximum file size: Depends on server configuration

**Response:**
```json
{
  "class": "string",
  "confidence": "number"
}
```

**Class Values:**
- `"Early Blight"` - Fungal disease with dark lesions
- `"Late Blight"` - Serious disease with water-soaked lesions
- `"Healthy"` - No signs of disease detected

**Confidence:**
- Floating point number between 0.0 and 1.0
- Represents the model's confidence in the prediction

**Example Request:**
```bash
curl -X POST -F "file=@potato_leaf.jpg" http://localhost:8000/predict
```

**Example Response:**
```json
{
  "class": "Early Blight",
  "confidence": 0.9567
}
```

## 🛠️ API Implementation Details

### Model Loading
The TensorFlow model is loaded once when the API starts:

```python
MODEL = tf.keras.models.load_model("/app/saved_model")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
```

### Image Processing Pipeline
1. **File Reception**: Image received as multipart form data
2. **Conversion**: PIL Image converted to NumPy array
3. **Preprocessing**: 
   - Resize to 256x256 pixels
   - Normalize pixel values to 0-1 range
   - Add batch dimension
4. **Prediction**: Model inference on preprocessed image
5. **Result Processing**: Extract class and confidence

### Error Handling
The API includes comprehensive error handling:

```python
try:
    # Image processing and prediction
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(img_batch)
    # ...
except Exception as e:
    logger.error(f"Error during prediction: {str(e)}")
    raise HTTPException(status_code=500, detail=str(e))
```

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success - Prediction returned |
| 400 | Bad Request - Invalid file or parameters |
| 422 | Unprocessable Entity - File validation failed |
| 500 | Internal Server Error - Processing failed |

## 🧪 Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:8000/ping

# Prediction
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/predict
```

### Using Python
```python
import requests

# Health check
response = requests.get("http://localhost:8000/ping")
print(response.text)

# Prediction
with open('potato_leaf.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post("http://localhost:8000/predict", files=files)
    print(response.json())
```

### Using JavaScript (Node.js)
```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

// Health check
axios.get('http://localhost:8000/ping')
  .then(response => console.log(response.data));

// Prediction
const form = new FormData();
form.append('file', fs.createReadStream('potato_leaf.jpg'));

axios.post('http://localhost:8000/predict', form, {
  headers: form.getHeaders()
}).then(response => {
  console.log(response.data);
});
```

## 🔧 Configuration

### Environment Variables
The API can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHONPATH` | `/app` | Python path configuration |

### Model Path
The model is expected at `/app/saved_model` in the container, which maps to `./saved_models/1` in the host.

## 📈 Performance Metrics

### Response Times
- **Health Check**: < 10ms
- **Prediction**: 50-200ms (depending on hardware)

### Throughput
- **Concurrent Requests**: Limited by available CPU/memory
- **Batch Processing**: Not currently implemented (single image at a time)

## 🔒 Security Considerations

### Input Validation
- File type checking
- Size limitations
- Sanitization of filenames

### Error Handling
- Generic error messages to prevent information leakage
- Logging of detailed errors for debugging

### CORS Policy
Configured to allow requests from:
- `http://localhost`
- `http://localhost:3000`
- `http://api:8000`

## 🔄 Integration Examples

### Frontend Integration (JavaScript)
```javascript
const predictImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://localhost:8000/predict", 
      formData, 
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
```

### Mobile Integration (React Native)
```javascript
const getPredication = async params => {
  return new Promise((resolve, reject) => {
    var bodyFormData = new FormData();
    bodyFormData.append('file', params);
    const url = Config.URL;
    return axios
      .post(url, bodyFormData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject('err', error);
      });
  });
};
```

## 📊 API Monitoring

### Logging
All API requests are logged with:
- Timestamp
- Request method and path
- Response status code
- Processing time
- Error details (when applicable)

### Health Monitoring
Regular health checks should be performed:
```bash
curl http://localhost:8000/ping
```

## 🚀 Deployment Considerations

### Production Deployment
For production use, consider:
1. **HTTPS**: Secure communication
2. **Rate Limiting**: Prevent abuse
3. **Load Balancing**: Distribute requests
4. **Monitoring**: Track performance and errors
5. **Backup**: Regular model backups

### Scaling
The API is stateless and can be scaled horizontally by:
1. Running multiple instances
2. Using a load balancer
3. Sharing model files through network storage

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [TensorFlow Serving](https://www.tensorflow.org/tfx/guide/serving)
- [Docker Deployment Guide](DOCKER.md)