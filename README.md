# 🥔 Potato Disease Classification System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/tensorflow-2.5.0-orange)](https://www.tensorflow.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.68.1-green)](https://fastapi.tiangolo.com/)

A comprehensive machine learning application for detecting potato plant diseases using deep learning. The system can identify three conditions: Early Blight, Late Blight, and Healthy plants with high accuracy.

## 🌟 Features

- **AI-Powered Disease Detection**: Uses a trained CNN model to identify potato leaf diseases
- **Multi-Platform Support**: Web application, mobile app, and RESTful API
- **Real-time Classification**: Instant disease detection with confidence scores
- **Docker Deployment**: Containerized services for easy deployment
- **Cloud Ready**: Supports deployment on Google Cloud Platform
- **Responsive UI**: Modern, user-friendly interface built with React and Tailwind CSS

## 📁 Project Structure

```
potato-disease-classification/
├── api/                    # FastAPI backend with TensorFlow model
├── frontend/               # ReactJS web application
├── mobile-app/             # React Native mobile application
├── saved_models/           # Pre-trained TensorFlow models
├── tf-lite-models/         # TensorFlow Lite models for mobile
├── training/               # Jupyter notebooks for model training
├── gcp/                    # Google Cloud Platform deployment files
├── docker-compose.yml      # Docker Compose configuration
├── DOCKER.md               # Docker deployment guide
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd potato-disease-classification

# Configure environment variables
cp .env.example .env

# Build and run the application
docker-compose up --build

# Access the applications:
# Web Interface: http://localhost:3000
# API Endpoint: http://localhost:8000
```

### Option 2: Manual Installation

#### Backend API Setup

```bash
# Navigate to API directory
cd api

# Install Python dependencies
pip3 install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

## 🧠 How It Works

The system uses a Convolutional Neural Network (CNN) trained on a dataset of potato leaf images to classify plant health conditions:

1. **Image Upload**: Users upload a photo of a potato leaf through the web or mobile interface
2. **Preprocessing**: The image is resized and normalized to match training conditions
3. **Prediction**: The TensorFlow model analyzes the image and predicts the disease class
4. **Results**: The system returns the predicted class and confidence score

### Supported Disease Classes

- **Early Blight**: A fungal disease causing dark lesions on lower leaves
- **Late Blight**: A serious disease that can destroy entire crops rapidly
- **Healthy**: No signs of disease detected

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   Web Client    │    │  Mobile Client   │    │   API Service      │
│   (ReactJS)     │    │ (React Native)   │    │   (FastAPI)        │
└─────────┬───────┘    └────────┬─────────┘    └────────┬───────────┘
          │                     │                       │
          └─────────────────────┼───────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Disease Prediction   │
                    │      (TensorFlow)     │
                    └───────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    Model Storage      │
                    │  (Saved TensorFlow    │
                    │       Models)         │
                    └───────────────────────┘
```

## 📱 Platforms

### Web Application
- Built with ReactJS and TypeScript
- Responsive design for desktop and mobile browsers
- Drag-and-drop image upload interface
- Real-time prediction results with confidence scores

### Mobile Application
- Cross-platform mobile app using React Native
- Camera integration for direct photo capture
- Gallery access for selecting existing images
- Offline-ready with cloud synchronization

### RESTful API
- FastAPI backend for model inference
- JSON-based communication
- CORS-enabled for web integration
- Health check and prediction endpoints

## 🐳 Docker Deployment

The application is fully containerized with Docker for easy deployment:

- **API Service**: Runs on port 8000
- **Frontend Service**: Runs on port 3000
- **Network**: Services communicate through a custom bridge network

See [DOCKER.md](DOCKER.md) for detailed Docker deployment instructions.

## ☁️ Cloud Deployment

### Google Cloud Platform
The application supports deployment to Google Cloud Functions with both standard and TensorFlow Lite models.

## 🛠️ Development Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- Docker and Docker Compose (for containerized deployment)
- Git

### Environment Configuration

Copy the example environment files and customize as needed:

```bash
# Root directory
cp .env.example .env

# Frontend
cp frontend/.env.example frontend/.env

# Mobile App
cp mobile-app/.env.example mobile-app/.env
```

## 📚 Documentation

- [Architecture Documentation](ARCHITECTURE.md) - Detailed system architecture
- [API Documentation](API_DOCS.md) - Complete API endpoints and usage
- [User Guides](USER_GUIDES.md) - Platform-specific instructions
- [Development Guide](DEVELOPMENT.md) - Setup and contribution guidelines
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- [Model Training](MODEL_TRAINING.md) - Technical documentation for training

## 🤝 Contributing

Contributions are welcome! Please read our [Development Guide](DEVELOPMENT.md) for information on setting up the development environment and contributing guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dataset provided by [Plant Village](https://www.kaggle.com/arjuntejaswi/plant-village)
- Built with TensorFlow, FastAPI, React, and React Native
- Inspired by agricultural technology initiatives for crop protection

---

*Protect your harvest before it's too late with AI-powered potato disease detection.*
