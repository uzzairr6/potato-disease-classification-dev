# 🧠 Model Training Documentation

Technical documentation for training, converting, and deploying machine learning models for the Potato Disease Classification System.

## 📋 Table of Contents

- [Dataset Information](#dataset-information)
- [Model Architecture](#model-architecture)
- [Training Process](#training-process)
- [Model Evaluation](#model-evaluation)
- [Model Conversion](#model-conversion)
- [Deployment Preparation](#deployment-preparation)
- [Retraining Guidelines](#retraining-guidelines)
- [Performance Optimization](#performance-optimization)

## 📊 Dataset Information

### Source Dataset
The model is trained on the Plant Village dataset, specifically the potato disease subset:
- **Source**: [Plant Village Dataset on Kaggle](https://www.kaggle.com/arjuntejaswi/plant-village)
- **Classes**: 3 (Early Blight, Late Blight, Healthy)
- **Image Size**: 256x256 RGB
- **Format**: JPEG images

### Dataset Preparation
1. **Download**: Obtain the dataset from Kaggle
2. **Filter**: Keep only potato-related folders:
   - `Potato___Early_blight`
   - `Potato___Late_blight`
   - `Potato___healthy`
3. **Organize**: Structure data in train/validation/test splits

### Data Preprocessing
```python
# Image preprocessing pipeline
def preprocess_image(image_path):
    image = tf.io.read_file(image_path)
    image = tf.image.decode_image(image, channels=3)
    image = tf.image.resize(image, [256, 256])
    image = tf.cast(image, tf.float32) / 255.0
    return image
```

### Data Augmentation
To improve model robustness:
- Random rotation (±20 degrees)
- Random zoom (±10%)
- Horizontal flipping
- Brightness adjustment (±10%)
- Contrast adjustment (±10%)

## 🏗️ Model Architecture

### Base Architecture
The model uses transfer learning with a pre-trained base:

```python
# Base model selection
base_model = tf.keras.applications.EfficientNetB0(
    input_shape=(256, 256, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model layers
base_model.trainable = False

# Add custom classifier head
model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(3, activation='softmax')  # 3 classes
])
```

### Model Summary
```
Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #
=================================================================
efficientnetb0 (Functional)  (None, 8, 8, 1280)        4049564
_________________________________________________________________
global_average_pooling2d     (None, 1280)              0
_________________________________________________________________
dense                        (None, 128)               163968
_________________________________________________________________
dropout                      (None, 128)               0
_________________________________________________________________
dense_1                      (None, 3)                 387
=================================================================
Total params: 4,213,919
Trainable params: 164,355
Non-trainable params: 4,049,564
_________________________________________________________________
```

### Hyperparameters
- **Optimizer**: Adam
- **Learning Rate**: 0.001
- **Loss Function**: Categorical Crossentropy
- **Metrics**: Accuracy
- **Batch Size**: 32
- **Epochs**: 20 (initial training)

## 🚀 Training Process

### Environment Setup
```bash
# Navigate to training directory
cd training

# Install training dependencies
pip install -r requirements.txt
```

### Training Notebooks
The project includes Jupyter notebooks for different training approaches:

1. **Basic Training**: `potato-disease-classification-model.ipynb`
2. **Data Generator Approach**: `potato-disease-classification-model-using-image-data-generator.ipynb`

### Training Script Example
```python
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Data generators
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

train_generator = train_datagen.flow_from_directory(
    'dataset/train',
    target_size=(256, 256),
    batch_size=32,
    class_mode='categorical',
    subset='training'
)

validation_generator = train_datagen.flow_from_directory(
    'dataset/train',
    target_size=(256, 256),
    batch_size=32,
    class_mode='categorical',
    subset='validation'
)

# Compile model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train model
history = model.fit(
    train_generator,
    epochs=20,
    validation_data=validation_generator
)

# Save model
model.save('potatoes.h5')
```

### Training Monitoring
Track training progress with callbacks:
```python
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.2, patience=2),
    tf.keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True)
]
```

## 📈 Model Evaluation

### Performance Metrics
- **Accuracy**: Overall correctness
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall

### Evaluation Code
```python
# Evaluate model
test_loss, test_accuracy = model.evaluate(test_generator)
print(f'Test Accuracy: {test_accuracy:.4f}')

# Confusion Matrix
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix

predictions = model.predict(test_generator)
predicted_classes = np.argmax(predictions, axis=1)
true_classes = test_generator.classes

# Classification report
print(classification_report(true_classes, predicted_classes, 
                          target_names=class_names))

# Confusion matrix
print(confusion_matrix(true_classes, predicted_classes))
```

### Visualization
```python
import matplotlib.pyplot as plt

# Plot training history
def plot_training_history(history):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    ax1.plot(history.history['accuracy'], label='Training Accuracy')
    ax1.plot(history.history['val_accuracy'], label='Validation Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Accuracy')
    ax1.legend()
    
    # Loss
    ax2.plot(history.history['loss'], label='Training Loss')
    ax2.plot(history.history['val_loss'], label='Validation Loss')
    ax2.set_title('Model Loss')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Loss')
    ax2.legend()
    
    plt.tight_layout()
    plt.show()
```

## 🔁 Model Conversion

### TensorFlow Lite Conversion
Convert models for mobile deployment:

#### Post-Training Quantization
```python
# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save TFLite model
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

#### Quantization-Aware Training
For better accuracy with quantization:

1. **Create Quantization Model**:
   ```python
   import tensorflow_model_optimization as tmo
   
   # Quantize model
   quantize_model = tmo.quantization.quantize_model
   q_aware_model = quantize_model(model)
   
   # Retrain quantization-aware model
   q_aware_model.compile(optimizer='adam',
                        loss='categorical_crossentropy',
                        metrics=['accuracy'])
   
   q_aware_model.fit(train_generator, epochs=5,
                    validation_data=validation_generator)
   ```

2. **Convert to TFLite**:
   ```python
   converter = tf.lite.TFLiteConverter.from_keras_model(q_aware_model)
   converter.optimizations = [tf.lite.Optimize.DEFAULT]
   quantized_tflite_model = converter.convert()
   
   with open('quantized_model.tflite', 'wb') as f:
       f.write(quantized_tflite_model)
   ```

### Model Comparison
| Model Type | Size | Accuracy Drop | Inference Speed |
|------------|------|---------------|-----------------|
| Full Model | ~8MB | 0% | Baseline |
| TFLite (FP32) | ~2MB | ~1% | 2x faster |
| TFLite (INT8) | ~500KB | ~3-5% | 3-4x faster |

## 📦 Deployment Preparation

### Saving Models

#### SavedModel Format (for TensorFlow Serving)
```python
# Save in SavedModel format
model.save('saved_model/1')

# Directory structure:
# saved_model/
# └── 1/
#     ├── saved_model.pb
#     ├── keras_metadata.pb
#     └── variables/
#         ├── variables.data-00000-of-00001
#         └── variables.index
```

#### HDF5 Format (for direct loading)
```python
# Save in HDF5 format
model.save('potatoes.h5')
```

### Model Versioning
Organize models by version:
```
saved_models/
├── 1/          # Version 1
├── 2/          # Version 2
└── 3/          # Version 3
```

### Model Validation
Before deployment, validate model integrity:
```python
# Load and test model
loaded_model = tf.keras.models.load_model('saved_model/1')
test_image = preprocess_image('test_image.jpg')
prediction = loaded_model.predict(np.expand_dims(test_image, 0))
print(f'Prediction: {np.argmax(prediction)}')
```

## 🔄 Retraining Guidelines

### When to Retrain
Consider retraining when:
- Accuracy drops below acceptable threshold
- New disease variants emerge
- Seasonal variations affect performance
- User feedback indicates misclassifications

### Retraining Process

1. **Collect New Data**
   ```bash
   # Organize new data
   new_dataset/
   ├── Potato___Early_blight/
   ├── Potato___Late_blight/
   └── Potato___healthy/
   ```

2. **Fine-tune Existing Model**
   ```python
   # Load existing model
   model = tf.keras.models.load_model('saved_model/1')
   
   # Unfreeze some layers for fine-tuning
   for layer in model.layers[-20:]:
       layer.trainable = True
   
   # Recompile with lower learning rate
   model.compile(
       optimizer=tf.keras.optimizers.Adam(1e-5),
       loss='categorical_crossentropy',
       metrics=['accuracy']
   )
   
   # Train with new data
   model.fit(new_train_generator, 
            validation_data=new_validation_generator,
            epochs=10)
   ```

3. **Validate Performance**
   ```python
   # Compare old vs new model performance
   old_predictions = old_model.predict(test_data)
   new_predictions = new_model.predict(test_data)
   
   # Statistical significance testing
   from scipy import stats
   t_stat, p_value = stats.ttest_rel(old_scores, new_scores)
   ```

### Continuous Learning
Implement continuous learning pipeline:
1. **Feedback Collection**: Store user corrections
2. **Periodic Retraining**: Monthly/quarterly model updates
3. **A/B Testing**: Compare model versions
4. **Rollback Mechanism**: Revert to previous version if needed

## ⚡ Performance Optimization

### Model Optimization Techniques

#### Pruning
Remove unnecessary weights:
```python
import tensorflow_model_optimization as tmo

# Prune model
pruning_params = {
    'pruning_schedule': tmo.sparsity.keras.PolynomialDecay(
        initial_sparsity=0.50,
        final_sparsity=0.80,
        begin_step=0,
        end_step=1000
    )
}

model_for_pruning = tmo.sparsity.keras.prune_low_magnitude(
    model, **pruning_params)
```

#### Knowledge Distillation
Train smaller "student" model to mimic larger "teacher":
```python
# Teacher model (large, accurate)
teacher_model = load_large_model()

# Student model (small, fast)
student_model = create_small_model()

# Distillation loss
def distillation_loss(y_true, y_pred, teacher_pred, temperature=3):
    return tf.keras.losses.categorical_crossentropy(y_true, y_pred) + \
           tf.keras.losses.categorical_crossentropy(
               tf.nn.softmax(teacher_pred/temperature),
               tf.nn.softmax(y_pred/temperature))
```

### Hardware Acceleration

#### GPU Training
```python
# Check GPU availability
print("GPU Available: ", tf.config.list_physical_devices('GPU'))

# Enable mixed precision for faster training
policy = tf.keras.mixed_precision.Policy('mixed_float16')
tf.keras.mixed_precision.set_global_policy(policy)
```

#### TPU Training
```python
# TPU setup
resolver = tf.distribute.cluster_resolver.TPUClusterResolver(tpu='')
tf.config.experimental_connect_to_cluster(resolver)
tf.tpu.experimental.initialize_tpu_system(resolver)
strategy = tf.distribute.TPUStrategy(resolver)

# Model creation within strategy scope
with strategy.scope():
    model = create_model()
    model.compile(...)
```

### Inference Optimization

#### Batch Processing
Process multiple images simultaneously:
```python
# Batch inference
def batch_predict(images, model, batch_size=32):
    predictions = []
    for i in range(0, len(images), batch_size):
        batch = images[i:i+batch_size]
        batch_predictions = model.predict(batch)
        predictions.extend(batch_predictions)
    return predictions
```

#### Caching
Cache frequent predictions:
```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_predict(image_hash):
    # Load and preprocess image
    # Run prediction
    # Return results
    pass

def predict_with_cache(image):
    image_hash = hashlib.md5(image.tobytes()).hexdigest()
    return cached_predict(image_hash)
```

## 🧪 Testing and Validation

### Unit Tests for Model
```python
import unittest
import numpy as np

class TestPotatoDiseaseModel(unittest.TestCase):
    def setUp(self):
        self.model = tf.keras.models.load_model('saved_model/1')
        self.class_names = ['Early Blight', 'Late Blight', 'Healthy']
    
    def test_model_prediction_shape(self):
        """Test that model outputs correct shape"""
        dummy_input = np.random.rand(1, 256, 256, 3)
        predictions = self.model.predict(dummy_input)
        self.assertEqual(predictions.shape, (1, 3))
    
    def test_probability_distribution(self):
        """Test that predictions sum to 1"""
        dummy_input = np.random.rand(1, 256, 256, 3)
        predictions = self.model.predict(dummy_input)
        self.assertAlmostEqual(np.sum(predictions), 1.0, places=5)
    
    def test_known_samples(self):
        """Test predictions on known samples"""
        # Load test images with known labels
        # Assert predictions match expectations within tolerance
        pass

if __name__ == '__main__':
    unittest.main()
```

### Integration Tests
```python
import requests
import os

class TestAPIModelIntegration(unittest.TestCase):
    def setUp(self):
        self.api_url = os.getenv('API_URL', 'http://localhost:8000')
    
    def test_health_endpoint(self):
        """Test API health check"""
        response = requests.get(f'{self.api_url}/ping')
        self.assertEqual(response.status_code, 200)
    
    def test_prediction_endpoint(self):
        """Test prediction endpoint"""
        with open('test_images/healthy_potato.jpg', 'rb') as f:
            files = {'file': f}
            response = requests.post(f'{self.api_url}/predict', files=files)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('class', data)
        self.assertIn('confidence', data)
```

## 📊 Monitoring and Metrics

### Training Metrics Dashboard
Track key metrics during training:
- Loss curves
- Accuracy trends
- Learning rate schedules
- Gradient norms
- Activation distributions

### Production Monitoring
Monitor model performance in production:
- Prediction latency
- Accuracy drift
- Input distribution shifts
- Resource utilization
- Error rates

### Alerting System
Set up alerts for:
- Sudden accuracy drops
- Increased error rates
- Resource exhaustion
- Model staleness

## 📚 Additional Resources

### Research Papers
- [Deep Learning for Plant Disease Detection](https://arxiv.org/abs/2008.05693)
- [Transfer Learning in Agriculture](https://arxiv.org/abs/1907.07756)
- [EfficientNet: Rethinking Model Scaling](https://arxiv.org/abs/1905.11946)

### Tools and Libraries
- [TensorFlow Model Optimization Toolkit](https://www.tensorflow.org/model_optimization)
- [TensorFlow Lite](https://www.tensorflow.org/lite)
- [Keras Tuner](https://keras.io/keras_tuner/)
- [Weights & Biases](https://wandb.ai/site)

### Best Practices
- [Machine Learning Best Practices](https://developers.google.com/machine-learning/guides/rules-of-ml)
- [Model Deployment Checklist](https://github.com/eugeneyan/ml-checklists)
- [MLOps Framework](https://ml-ops.org/)

## 🚀 Future Improvements

### Model Enhancements
1. **Ensemble Methods**: Combine multiple models for better accuracy
2. **Attention Mechanisms**: Focus on disease-specific regions
3. **Self-supervised Learning**: Reduce dependency on labeled data
4. **Few-shot Learning**: Adapt to new diseases with minimal examples

### Architecture Improvements
1. **Vision Transformers**: Experiment with transformer-based architectures
2. **Neural Architecture Search**: Automatically optimize model structure
3. **Multi-task Learning**: Simultaneously detect multiple plant issues
4. **Domain Adaptation**: Improve performance across different environments

### Deployment Enhancements
1. **Edge Computing**: Deploy models directly on IoT devices
2. **Federated Learning**: Train models across distributed devices
3. **Model Compression**: Further reduce model size for mobile deployment
4. **Real-time Processing**: Optimize for video stream analysis