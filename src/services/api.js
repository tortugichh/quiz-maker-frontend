const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const logRequest = (method, url, data = null) => {
  console.log(`API ${method} Request:`, url, data ? { body: data } : '');
};

const logResponse = (method, url, response) => {
  console.log(`API ${method} Response from ${url}:`, response);
};



const fetchWithError = async (url, options = {}) => {
  const method = options.method || 'GET';
  logRequest(method, url, options.body);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 204) {
      logResponse(method, url, 'No Content (204)');
      return null;
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Ошибка при обработке ответа от сервера');
    }

    logResponse(method, url, data);

    if (!response.ok) {
      const errorMessage = data.message || 'Что-то пошло не так';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
};


export const testsApi = {
  getTests: async (params = {}) => {
    const { page, limit, search, tag } = params;
    let url = `${API_BASE_URL}/tests`;
    
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (search) queryParams.append('search', search);
    if (tag) queryParams.append('tag', tag);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return fetchWithError(url);
  },
  
  getTest: async (id) => {
    if (!id) {
      throw new Error('ID теста не указан');
    }
    return fetchWithError(`${API_BASE_URL}/tests/${id}`);
  },
  
  createTest: async (testData) => {
    if (!testData) {
      throw new Error('Данные теста не указаны');
    }
    return fetchWithError(`${API_BASE_URL}/tests`, {
      method: 'POST',
      body: JSON.stringify(testData)
    });
  },
  
  updateTest: async (id, testData) => {
    if (!id) {
      throw new Error('ID теста не указан');
    }
    if (!testData) {
      throw new Error('Данные теста не указаны');
    }
    return fetchWithError(`${API_BASE_URL}/tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData)
    });
  },
  
  deleteTest: async (id) => {
    if (!id) {
      throw new Error('ID теста не указан');
    }
    return fetchWithError(`${API_BASE_URL}/tests/${id}`, {
      method: 'DELETE'
    });
  },
  
  checkAnswers: async (testId, answers) => {
    if (!testId) {
      throw new Error('ID теста не указан');
    }
    if (!answers || typeof answers !== 'object') {
      throw new Error('Ответы должны быть объектом');
    }
    return fetchWithError(`${API_BASE_URL}/tests/${testId}/check`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }
};


export const questionsApi = {
  addQuestion: async (testId, questionData) => {
    if (!testId) {
      throw new Error('ID теста не указан');
    }
    if (!questionData) {
      throw new Error('Данные вопроса не указаны');
    }
    return fetchWithError(`${API_BASE_URL}/tests/${testId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  },
  
  updateQuestion: async (id, questionData) => {
    if (!id) {
      throw new Error('ID вопроса не указан');
    }
    if (!questionData) {
      throw new Error('Данные вопроса не указаны');
    }
    return fetchWithError(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    });
  },
  
  deleteQuestion: async (id) => {
    if (!id) {
      throw new Error('ID вопроса не указан');
    }
    return fetchWithError(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE'
    });
  }
};

export { API_BASE_URL };