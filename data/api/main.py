

# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# import numpy as np
# from io import BytesIO
# from PIL import Image
# import tensorflow as tf

# from auth import router as auth_router, get_current_user

# app = FastAPI()

# origins = [
#     "http://localhost",
#     "http://localhost:3000",
#     "http://localhost:5173",  # Vite default port
#     "http://127.0.0.1:3000",
#     "http://127.0.0.1:5173",
#     "http://api:8000",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include authentication routes
# app.include_router(auth_router)

# MODEL = tf.keras.models.load_model("/app/saved_model")

# CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# @app.get("/ping")
# async def ping():
#     return "Hello, I am alive"

# def read_file_as_image(data) -> np.ndarray:
#     image = np.array(Image.open(BytesIO(data)))
#     return image

# @app.post("/predict")
# async def predict(
#     file: UploadFile = File(...),
#     current_user: dict = Depends(get_current_user)
# ):
#     logger.info(f"Received file: {file.filename} from user {current_user['email']}")
#     try:
#         image = read_file_as_image(await file.read())
#         logger.info("Image processed successfully")
#         img_batch = np.expand_dims(image, 0)
        
#         predictions = MODEL.predict(img_batch)
#         logger.info("Prediction completed")

#         predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
#         confidence = np.max(predictions[0])
        
#         logger.info(f"Prediction: {predicted_class}, Confidence: {confidence}")
#         return {
#             'class': predicted_class,
#             'confidence': float(confidence)
#         }
#     except Exception as e:
#         logger.error(f"Error during prediction: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     uvicorn.run(app, host='localhost', port=8000)

import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

from auth import router as auth_router, get_current_user

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://api:8000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

BASE_DIR = Path(__file__).resolve().parent
candidate_paths = [
    BASE_DIR / "saved_model",
    BASE_DIR / "potatoes.h5",
]

MODEL_PATH = next((p for p in candidate_paths if p.exists()), None)

if MODEL_PATH is None:
    raise FileNotFoundError(
        f"Model not found. Checked: {[str(p) for p in candidate_paths]}"
    )

logger.info(f"Loading model from: {MODEL_PATH}")
import os

print("APP FILES:", os.listdir("/app"))
print("SAVED_MODEL EXISTS:", os.path.exists("/app/saved_model"))
print("SAVED_MODEL FILES:", os.listdir("/app/saved_model") if os.path.exists("/app/saved_model") else "missing")
MODEL = tf.keras.models.load_model(str(MODEL_PATH))

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    logger.info(f"Received file: {file.filename} from user {current_user['email']}")
    try:
        image = read_file_as_image(await file.read())
        logger.info("Image processed successfully")
        img_batch = np.expand_dims(image, 0)

        predictions = MODEL.predict(img_batch)
        logger.info("Prediction completed")

        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])

        logger.info(f"Prediction: {predicted_class}, Confidence: {confidence}")
        return {
            'class': predicted_class,
            'confidence': float(confidence)
        }
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)