import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add backend JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Added backend JWT to request:', config.url);
      } else {
        console.log('⚠️ No token found for request:', config.url);
      }
    } catch (error) {
      console.error('❌ Error in request interceptor:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const publicPaths = ['/login', '/signup', '/admin', '/'];
      const currentPath = window.location.pathname;
      
      if (!publicPaths.includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend may be down');
      error.message = 'Unable to connect to server. Please check if the backend is running.';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/admin/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getByCategory: (categorySlug, params = {}) => 
    api.get(`/products/category/${categorySlug}`, { params }),
  search: (keyword, params = {}) => 
    api.get('/products/search', { params: { keyword, ...params } }),
  getTopRated: () => api.get('/products/top-rated'),
  getNewest: () => api.get('/products/newest'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

// Cart API (if you implement backend cart)
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity, size, color) => 
    api.post('/cart/add', { productId, quantity, size, color }),
  updateItem: (itemId, quantity) => 
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addItem: (productId) => api.post('/wishlist/add', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/remove/${productId}`),
  clearWishlist: () => api.delete('/wishlist/clear'),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders/create', orderData),
  getMyOrders: (params = {}) => api.get('/orders/my-orders', { params }),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Admin API
export const adminAPI = {
  // Users
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserStatus: (userId, enabled) => api.put(`/admin/users/${userId}/status`, { enabled }),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  
  // Products
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (productId, productData) => api.put(`/admin/products/${productId}`, productData),
  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),
  updateProductStatus: (productId, statusData) => api.put(`/admin/products/${productId}/status`, statusData),
  updateProductStock: (productId, stockData) => api.put(`/admin/products/${productId}/stock`, stockData),
  
  // Orders
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  
  // Storage
  uploadFile: (file, categorySlug, filename) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categorySlug', categorySlug);
    formData.append('filename', filename);
    return api.post('/admin/storage/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;