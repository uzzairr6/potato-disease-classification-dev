# 🛠️ Development Guide

Comprehensive guide for setting up the development environment and contributing to the Potato Disease Classification System.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Repository Setup](#repository-setup)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [Mobile Development](#mobile-development)
- [Docker Development](#docker-development)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Contributing](#contributing)
- [Branching Strategy](#branching-strategy)
- [Release Process](#release-process)

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 10GB free space
- **Internet Connection**: Required for dependency installation

### Required Software

#### Core Dependencies
- **Git**: Version control system
- **Python**: 3.8+ (for backend)
- **Node.js**: 16+ (for frontend)
- **Docker**: For containerization
- **Docker Compose**: For multi-container applications

#### Optional Tools
- **Visual Studio Code**: Recommended IDE
- **Postman**: API testing
- **Jupyter Notebook**: For model training
- **Android Studio**: For mobile development
- **Xcode**: For iOS mobile development

### Installing Prerequisites

#### Windows
```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install required tools
choco install git python nodejs docker-desktop
```

#### macOS
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required tools
brew install git python node docker
```

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install required tools
sudo apt install git python3 python3-pip nodejs npm docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

## 📦 Repository Setup

### Cloning the Repository
```bash
git clone <repository-url>
cd potato-disease-classification
```

### Initial Configuration
```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp mobile-app/.env.example mobile-app/.env

# Install pre-commit hooks (if configured)
# pip install pre-commit
# pre-commit install
```

## 🐍 Backend Development (API)

### Setting Up Python Environment
```bash
# Navigate to API directory
cd api

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the API Locally
```bash
# With virtual environment activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Development Workflow
1. **Code Changes**: Modify files in `api/` directory
2. **Hot Reload**: Uvicorn automatically reloads on file changes
3. **API Docs**: Visit `http://localhost:8000/docs` for interactive documentation
4. **Testing**: Use Postman or curl to test endpoints

### Adding New Dependencies
```bash
# Install new package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt
```

### Backend Project Structure
```
api/
├── main.py              # FastAPI application entry point
├── main-tf-serving.py   # Alternative with TensorFlow Serving
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker configuration
└── models.config.example # TF Serving configuration template
```

## ⚛️ Frontend Development (Web)

### Setting Up Node.js Environment
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Running Development Server
```bash
# Start development server with hot reload
npm run dev
```

### Frontend Development Workflow
1. **Code Changes**: Modify files in `frontend/src/` directory
2. **Hot Reload**: Vite automatically refreshes the browser
3. **Component Development**: Create components in `src/components/`
4. **State Management**: Use React hooks for state management

### Adding New Dependencies
```bash
# Install new package
npm install package-name

# Install development dependency
npm install --save-dev package-name
```

### Frontend Project Structure
```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   ├── ui/          # UI components
│   │   └── auth/        # Authentication components
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## 📱 Mobile Development

### Setting Up React Native Environment
Follow the official React Native CLI setup guide:
https://reactnative.dev/docs/environment-setup

#### Android Setup
1. Install Android Studio
2. Set up Android SDK
3. Configure environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### iOS Setup (macOS only)
1. Install Xcode from App Store
2. Install Xcode Command Line Tools
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```

### Running Mobile App
```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
yarn install

# iOS only: Install pods
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Mobile Development Workflow
1. **Code Changes**: Modify files in `mobile-app/` directory
2. **Hot Reload**: Metro bundler automatically refreshes the app
3. **Native Modules**: Link native dependencies when added
4. **Platform Specific Code**: Use platform-specific extensions (.ios.js, .android.js)

### Mobile Project Structure
```
mobile-app/
├── App.js               # Main application component
├── index.js             # Entry point
├── android/             # Android native code
├── ios/                 # iOS native code
├── package.json         # Dependencies and scripts
└── .env                 # Environment configuration
```

## 🐳 Docker Development

### Building Docker Images
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api
docker-compose build frontend
```

### Development with Docker
```bash
# Run in development mode with hot reload
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

### Docker Development Workflow
1. **Code Changes**: Modify source files (volume-mounted)
2. **Auto Reload**: Frontend hot reloads, API restarts on changes
3. **Debugging**: Access containers with `docker-compose exec`
4. **Testing**: Run tests inside containers

### Docker Project Structure
```
.
├── docker-compose.yml      # Multi-container configuration
├── .env                    # Environment variables
├── api/
│   └── Dockerfile          # API Docker configuration
└── frontend/
    └── Dockerfile          # Frontend Docker configuration
```

## 🧪 Testing

### Backend Testing
```bash
# Navigate to API directory
cd api

# Run tests (if any)
# python -m pytest tests/
```

### Frontend Testing
```bash
# Navigate to frontend directory
cd frontend

# Run ESLint
npm run lint

# Run tests (if configured)
# npm test
```

### Mobile Testing
```bash
# Navigate to mobile app directory
cd mobile-app

# Run tests
npm test
```

### API Testing with cURL
```bash
# Health check
curl http://localhost:8000/ping

# Prediction
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/predict
```

### API Testing with Postman
1. Import the collection (if available)
2. Set environment variables
3. Run test requests

## ✨ Code Quality

### Code Style Guidelines

#### Python (Backend)
- Follow PEP 8 style guide
- Use type hints where possible
- Write docstrings for functions and classes
- Keep functions small and focused

#### TypeScript/JavaScript (Frontend)
- Use TypeScript for type safety
- Follow Airbnb JavaScript style guide
- Use functional components with hooks
- Write JSDoc comments for complex functions

#### React/React Native
- Use functional components over class components
- Implement proper error boundaries
- Use React hooks appropriately
- Optimize performance with useMemo/useCallback

### Linting

#### Backend Linting
```bash
# Install pylint/flake8 (if not already installed)
pip install pylint flake8

# Run linting
# pylint api/
# flake8 api/
```

#### Frontend Linting
```bash
# Navigate to frontend directory
cd frontend

# Run ESLint
npm run lint
```

### Formatting

#### Python Formatting
```bash
# Install black (if not already installed)
pip install black

# Format code
# black api/
```

#### JavaScript/TypeScript Formatting
```bash
# Navigate to frontend directory
cd frontend

# Format code with Prettier
# npx prettier --write src/
```

## 🤝 Contributing

### How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button on GitHub
   - Clone your forked repository

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, well-documented code
   - Follow the style guidelines
   - Add tests if applicable

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add feature: brief description"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### Pull Request Guidelines

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Updated existing tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Code Review Process

1. **Automated Checks**
   - CI pipeline runs tests
   - Linting checks pass
   - Security scans complete

2. **Manual Review**
   - At least one maintainer reviews
   - Feedback provided within 48 hours
   - Changes requested if needed

3. **Approval and Merge**
   - All checks pass
   - Reviewer approves
   - Maintainer merges

## 🌿 Branching Strategy

### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features

### Supporting Branches
- **feature/**: New features
- **bugfix/**: Bug fixes
- **hotfix/**: Critical production fixes
- **release/**: Release preparation

### Branch Naming Convention
```
feature/add-user-authentication
bugfix/fix-login-error
hotfix/critical-security-patch
release/v1.2.0
```

### Git Workflow
1. **Feature Development**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   ```

2. **Bug Fixes**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b bugfix/issue-description
   # Fix bug
   git push origin bugfix/issue-description
   ```

3. **Hot Fixes**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-fix
   # Apply fix
   git push origin hotfix/critical-fix
   ```

## 🚀 Release Process

### Versioning
We follow Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

### Release Steps

1. **Prepare Release Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/vX.Y.Z
   ```

2. **Update Version Numbers**
   - Update version in `frontend/package.json`
   - Update version in `mobile-app/package.json`
   - Update version references in documentation

3. **Final Testing**
   - Run all tests
   - Manual QA
   - Performance testing

4. **Merge to Main**
   ```bash
   git checkout main
   git merge release/vX.Y.Z
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin main --tags
   ```

5. **Merge Back to Develop**
   ```bash
   git checkout develop
   git merge release/vX.Y.Z
   git push origin develop
   ```

6. **Clean Up**
   ```bash
   git branch -d release/vX.Y.Z
   ```

## 📚 Additional Resources

### Documentation
- [Architecture Documentation](ARCHITECTURE.md)
- [API Documentation](API_DOCS.md)
- [User Guides](USER_GUIDES.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

### External Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)
- [React Native Documentation](https://reactnative.dev/)
- [TensorFlow Documentation](https://www.tensorflow.org/)
- [Docker Documentation](https://docs.docker.com/)

### Community
- GitHub Discussions
- Issue Tracker
- Contribution Guidelines