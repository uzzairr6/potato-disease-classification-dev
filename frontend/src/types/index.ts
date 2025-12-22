export interface PredictionResponse {
  class: string;
  confidence: number;
}

export interface ImageUploadState {
  selectedFile: File | null;
  preview: string | null;
  data: PredictionResponse | null;
  image: boolean;
  isLoading: boolean;
}