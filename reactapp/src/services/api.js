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

  try {
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

    // Handle empty responses
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};
// Update the enrollInCourse function in api.js
export const enrollInCourse = async (courseId) => {
  try {
    // Get the student email from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const studentEmail = user?.email;
    
    if (!studentEmail) {
      throw new Error('User email not found. Please log in again.');
    }

    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll?student=${encodeURIComponent(studentEmail)}`, {
      method: 'PUT', // Changed from POST to PUT to match your backend
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Enrollment failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Enrollment error:', error);
    throw error;
  }
};
// Add this to your api.js file
export const debugAPI = {
  testEnrollment: async (courseId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const studentEmail = user?.email;
      const token = localStorage.getItem('token');
      
      console.log('Debug info:', {
        courseId,
        studentEmail,
        hasToken: !!token,
        apiBaseUrl: API_BASE_URL
      });
      
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll?student=${encodeURIComponent(studentEmail)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers]));
      
      const text = await response.text();
      console.log('Response text:', text);
      
      try {
        const data = JSON.parse(text);
        return { status: response.status, data };
      } catch {
        return { status: response.status, data: text };
      }
    } catch (error) {
      console.error('Debug error:', error);
      throw error;
    }
  }
};
export const quizAPI = {
  getQuizForModule: async (courseId, moduleNumber) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/quizzes/module-${moduleNumber}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Quiz fetch error:', error);
      return null;
    }
  },
  
  submitQuiz: async (quizId, answers) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ answers })
      });
      
      if (!response.ok) throw new Error('Quiz submission failed');
      
      return await response.json();
    } catch (error) {
      console.error('Quiz submission error:', error);
      throw error;
    }
  }
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
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || ["student"] // Send as array with ROLE_STUDENT
      }),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Courses API calls
export const coursesAPI = {
  getAll: async () => {
    try {
      const data = await apiRequest('/courses');
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return []; // Return empty array instead of throwing
    }
  },
  
  getById: (id) => apiRequest(`/courses/${id}`),
  
  create: (courseData) =>
    apiRequest('/admin/addCourse', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  update: (id, courseData) =>
    apiRequest(`/admin/editCourse/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),

  delete: (id) =>
    apiRequest(`/admin/deleteCourse/${id}`, {
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

  getEnrolledCourses: () => apiRequest('/user/enrolled-courses'),
  
  getCourseProgress: (courseId) =>
    apiRequest(`/user/courses/${courseId}/progress`),
};

// Mock data for development
const mockCourses = [
  {
    id: 1,
    courseName: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    category: 'Technology',
    instructor: 'John Doe',
    price: 49.99,
    enrolledCount: 1250,
    rating: 4.8,
    duration: 30,
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    courseName: 'Data Science with Python',
    description: 'Master data analysis, visualization, and machine learning with Python.',
    category: 'Science',
    instructor: 'Jane Smith',
    price: 59.99,
    enrolledCount: 890,
    rating: 4.7,
    duration: 45,
    createdAt: '2023-02-20'
  },
  {
    id: 3,
    courseName: 'UX/UI Design Principles',
    description: 'Create beautiful and functional user interfaces with proven design principles.',
    category: 'Design',
    instructor: 'Mike Johnson',
    price: 39.99,
    enrolledCount: 745,
    rating: 4.9,
    duration: 25,
    createdAt: '2023-03-10'
  },
  {
    id: 4,
    courseName: 'Mobile App Development',
    description: 'Build cross-platform mobile applications using React Native.',
    category: 'Technology',
    instructor: 'Sarah Wilson',
    price: 69.99,
    enrolledCount: 620,
    rating: 4.6,
    duration: 40,
    createdAt: '2023-04-05'
  },
  {
    id: 5,
    courseName: 'Business Management',
    description: 'Learn essential business management skills and strategies.',
    category: 'Business',
    instructor: 'Robert Brown',
    price: 54.99,
    enrolledCount: 1100,
    rating: 4.5,
    duration: 35,
    createdAt: '2023-01-30'
  },
   {
    id: 6,
    courseName: 'Digital Marketing Strategies',
    description: 'Learn to create effective digital marketing campaigns across platforms.',
    category: 'Business',
    instructor: 'Lisa Thompson',
    price: 49.99,
    enrolledCount: 950,
    rating: 4.4,
    duration: 28,
    createdAt: '2023-02-15'
  }
];

// Export the function that was missing
export const getCoursesWithFallback = async () => {
  try {
    const courses = await coursesAPI.getAll();
    // If API returns empty array or non-array, use mock data
    if (!Array.isArray(courses) || courses.length === 0) {
      console.warn('API returned no courses, using mock data');
      return mockCourses;
    }
    return courses;
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    return mockCourses;
  }
};

export default apiRequest;