import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Room management
  async createRoom(roomData) {
    try {
      const response = await this.client.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  }

  async getRoom(roomId) {
    try {
      const response = await this.client.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get room:', error);
      throw error;
    }
  }

  async getRoomUsers(roomId) {
    try {
      const response = await this.client.get(`/rooms/${roomId}/users`);
      return response.data;
    } catch (error) {
      console.error('Failed to get room users:', error);
      throw error;
    }
  }

  async updateRoom(roomId, roomData) {
    try {
      const response = await this.client.put(`/rooms/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Failed to update room:', error);
      throw error;
    }
  }

  async deleteRoom(roomId) {
    try {
      const response = await this.client.delete(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete room:', error);
      throw error;
    }
  }

  // Code management
  async saveCode(roomId, codeData) {
    try {
      const response = await this.client.post(`/rooms/${roomId}/code`, codeData);
      return response.data;
    } catch (error) {
      console.error('Failed to save code:', error);
      throw error;
    }
  }

  async getCodeHistory(roomId, limit = 10) {
    try {
      const response = await this.client.get(`/rooms/${roomId}/code/history`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get code history:', error);
      throw error;
    }
  }

  // File management
  async uploadFile(roomId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.client.post(`/rooms/${roomId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  async getRoomFiles(roomId) {
    try {
      const response = await this.client.get(`/rooms/${roomId}/files`);
      return response.data;
    } catch (error) {
      console.error('Failed to get room files:', error);
      throw error;
    }
  }

  async deleteFile(roomId, fileId) {
    try {
      const response = await this.client.delete(`/rooms/${roomId}/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  // Code execution
  async runCode(roomId, codeData) {
    try {
      const response = await this.client.post(`/rooms/${roomId}/execute`, codeData);
      return response.data;
    } catch (error) {
      console.error('Failed to run code:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
