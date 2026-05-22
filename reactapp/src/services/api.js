const API_BASE_URL = 'http://localhost:8080/api';

// ------------------- Generic API Request -------------------
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
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// ------------------- Map Course -------------------
const mapCourse = (course) => ({
  id: course.id,
  title: course.courseName || course.title || 'Untitled Course',
  type: course.category || course.type || 'General',
  description: course.description || '',
  instructor: course.instructor || '',
  price: course.price || 0,
  enrolledCount: course.enrolledCount || 0,
  rating: course.rating || 0,
  duration: course.duration || 0,
  createdAt: course.createdAt || '',
});

// ------------------- Auth API -------------------
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
        role: userData.role || ["student"],
      }),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ------------------- Courses API -------------------
export const coursesAPI = {
  getAll: async () => {
    try {
      const data = await apiRequest('/courses');
      // Extract courses array from backend response
      const coursesArray = Array.isArray(data?.courses) ? data.courses : [];
      return coursesArray.map(mapCourse);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // fallback to mockCourses if API fails
      return mockCourses.map(mapCourse);
    }
  },

  getById: async (id) => {
    const course = await apiRequest(`/courses/${id}`);
    return mapCourse(course);
  },

  create: (courseData) =>
    apiRequest('/courses', {
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

  enroll: async (courseId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const studentEmail = user?.email;
      if (!studentEmail) throw new Error('User email not found.');

      const response = await fetch(
        `${API_BASE_URL}/courses/${courseId}/enroll?student=${encodeURIComponent(studentEmail)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Enrollment failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enrollment error:', error);
      throw error;
    }
  },

  getProgress: (courseId) =>
    apiRequest(`/courses/${courseId}/progress`),

  updateProgress: (courseId, progress) =>
    apiRequest(`/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    }),
};

// ------------------- User API -------------------
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
// ------------------- Quiz API -------------------
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error('Quiz submission failed');
      return await response.json();
    } catch (error) {
      console.error('Quiz submission error:', error);
      throw error;
    }
  },
};

// ------------------- Debug Helper -------------------
export const debugAPI = {
  testEnrollment: async (courseId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const studentEmail = user?.email;
      const token = localStorage.getItem('token');

      console.log('Debug info:', { courseId, studentEmail, hasToken: !!token, apiBaseUrl: API_BASE_URL });

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll?student=${encodeURIComponent(studentEmail)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
  },
};

// ------------------- Mock Courses -------------------
const mockCourses = [
  { id: 1, courseName: 'Web Development Fundamentals', category: 'Technology', description: 'Learn HTML, CSS, JS', instructor: 'John Doe', price: 49.99, enrolledCount: 1250, rating: 4.8, duration: 30, createdAt: '2023-01-15' },
  { id: 2, courseName: 'Data Science with Python', category: 'Science', description: 'Learn Python for Data Science', instructor: 'Jane Smith', price: 59.99, enrolledCount: 890, rating: 4.7, duration: 45, createdAt: '2023-02-20' },
  { id: 3, courseName: 'UX/UI Design Principles', category: 'Design', description: 'Learn design principles', instructor: 'Mike Johnson', price: 39.99, enrolledCount: 745, rating: 4.9, duration: 25, createdAt: '2023-03-10' },
  { id: 4, courseName: 'Mobile App Development', category: 'Technology', description: 'Learn React Native', instructor: 'Sarah Wilson', price: 69.99, enrolledCount: 620, rating: 4.6, duration: 40, createdAt: '2023-04-05' },
  { id: 5, courseName: 'Business Management', category: 'Business', description: 'Learn business skills', instructor: 'Robert Brown', price: 54.99, enrolledCount: 1100, rating: 4.5, duration: 35, createdAt: '2023-01-30' },
  { id: 6, courseName: 'Digital Marketing Strategies', category: 'Business', description: 'Learn digital marketing', instructor: 'Lisa Thompson', price: 49.99, enrolledCount: 950, rating: 4.4, duration: 28, createdAt: '2023-02-15' },
];

// ------------------- Fallback function -------------------
// api.js - Fix the getCoursesWithFallback function
export const getCoursesWithFallback = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`);
    
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('API Response:', data); // Debug log to see actual response structure
    
    // Handle different possible response structures
    let backendCourses = [];
    
    if (Array.isArray(data)) {
      // If response is directly an array of courses
      backendCourses = data;
    } else if (data && Array.isArray(data.courses)) {
      // If response has courses property that is an array
      backendCourses = data.courses;
    } else if (data && Array.isArray(data.content)) {
      // If response has content property (common in paginated responses)
      backendCourses = data.content;
    } else if (data && data.data && Array.isArray(data.data)) {
      // If response has data property
      backendCourses = data.data;
    }
    
    console.log('Extracted courses:', backendCourses); // Debug log
    
    // Map backend course fields to frontend expected fields
    const mappedCourses = backendCourses.map(course => ({
      id: course.id || course.courseId,
      title: course.title || course.courseName || 'Untitled Course',
      type: course.type || course.category || course.courseType || 'General',
      description: course.description || '',
      instructor: course.instructor || course.createdBy || 'Unknown Instructor',
      price: course.price || 0,
      enrolledCount: course.enrolledCount || course.enrollments || 0,
      rating: course.rating || course.averageRating || 0,
      duration: course.duration || 0,
      createdAt: course.createdAt || course.createdDate || '',
      // Add any other fields your frontend expects
    }));
    
    return mappedCourses;
    
  } catch (error) {
    console.error('Error fetching backend courses, falling back to mock:', error);
    
    // Return mock courses if backend fails
    return mockCourses.map(course => ({
      ...course,
      type: course.category || 'General',
      title: course.courseName || course.title,
    }));
  }
};
// Add this line at the end of the file, before the default export:
export const enrollInCourse = coursesAPI.enroll;
// ------------------- Default Export -------------------
export default apiRequest;
