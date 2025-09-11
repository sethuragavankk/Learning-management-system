const API_BASE_URL = 'https://8080-acfdaebeabbdafadabdcfaceddbbabeaeefcea.premiumproject.examly.io/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Courses API calls
export const coursesAPI = {
  getAll: () => apiRequest('/courses'),
  
  getById: (id) => apiRequest(`/courses/${id}`),
  
  create: (courseData) =>
    apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  update: (id, courseData) =>
    apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),

  delete: (id) =>
    apiRequest(`/courses/${id}`, {
      method: 'DELETE',
    }),

  enroll: (courseId) =>
    apiRequest(`/courses/${courseId}/enroll`, {
      method: 'POST',
    }),

  getProgress: (courseId) =>
    apiRequest(`/courses/${courseId}/progress`),

  updateProgress: (courseId, progress) =>
    apiRequest(`/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    }),
};

// User API calls
export const userAPI = {
  getProfile: () => apiRequest('/user/profile'),
  
  updateProfile: (userData) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  getEnrolledCourses: () => apiRequest('/user/courses'),
};