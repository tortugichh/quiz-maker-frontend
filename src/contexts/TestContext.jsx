import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { testsApi, questionsApi } from '../services/api';

const TestContext = createContext(null);

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext должен использоваться внутри TestProvider');
  }
  return context;
};



export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [testResults, setTestResults] = useState(null);
  const [answers, setAnswers] = useState({});

  const clearError = useCallback(() => setError(null), []);

  const fetchTests = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Fetching tests with params:', params);
      const response = await testsApi.getTests(params);
      console.log('Tests response:', response);
      
      if (response && response.tests) {
        setTests(response.tests);
        setPagination({
          page: response.page || 1,
          limit: response.limit || 10,
          total: response.total || 0
        });
      } else {
        throw new Error('Неверный формат ответа от API');
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError(error.message || 'Ошибка при загрузке тестов');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const fetchTestById = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Fetching test by ID:', id);
      const test = await testsApi.getTest(id);
      console.log('Test response:', test);
      
      if (test) {
        setCurrentTest(test);
      } else {
        throw new Error('Тест не найден');
      }
      
      return test;
    } catch (error) {
      console.error('Error fetching test:', error);
      setError(error.message || 'Ошибка при загрузке теста');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const createTest = useCallback(async (testData) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Creating test with data:', testData);
      const newTest = await testsApi.createTest(testData);
      console.log('Created test:', newTest);
      
      if (newTest) {
        setTests((prevTests) => [...prevTests, newTest]);
      }
      
      return newTest;
    } catch (error) {
      console.error('Error creating test:', error);
      setError(error.message || 'Ошибка при создании теста');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const updateTest = useCallback(async (id, testData) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Updating test ID:', id, 'with data:', testData);
      const updatedTest = await testsApi.updateTest(id, testData);
      console.log('Updated test:', updatedTest);
      
      if (updatedTest) {
        setTests((prevTests) => 
          prevTests.map((test) => 
            test._id === id ? updatedTest : test
          )
        );
        
        if (currentTest && currentTest._id === id) {
          setCurrentTest(updatedTest);
        }
      }
      
      return updatedTest;
    } catch (error) {
      console.error('Error updating test:', error);
      setError(error.message || 'Ошибка при обновлении теста');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError, currentTest]);

  const deleteTest = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Deleting test ID:', id);
      await testsApi.deleteTest(id);
      
      setTests((prevTests) => 
        prevTests.filter((test) => test._id !== id)
      );
      
      if (currentTest && currentTest._id === id) {
        setCurrentTest(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting test:', error);
      setError(error.message || 'Ошибка при удалении теста');
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearError, currentTest]);

  const addQuestion = useCallback(async (testId, questionData) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Adding question to test ID:', testId, 'with data:', questionData);
      const newQuestion = await questionsApi.addQuestion(testId, questionData);
      console.log('Added question:', newQuestion);
      
      if (newQuestion && currentTest && currentTest._id === testId) {
        const updatedTest = JSON.parse(JSON.stringify(currentTest));
        
        if (!updatedTest.questions) {
          updatedTest.questions = [];
        }
        updatedTest.questions.push(newQuestion);
        
        setCurrentTest(updatedTest);
      }
      
      return newQuestion;
    } catch (error) {
      console.error('Error adding question:', error);
      setError(error.message || 'Ошибка при добавлении вопроса');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError, currentTest]);

  const updateQuestion = useCallback(async (id, questionData) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Updating question ID:', id, 'with data:', questionData);
      const updatedQuestion = await questionsApi.updateQuestion(id, questionData);
      console.log('Updated question:', updatedQuestion);
      
      if (updatedQuestion && currentTest) {
        const updatedTest = JSON.parse(JSON.stringify(currentTest));
        
        if (updatedTest.questions) {
          updatedTest.questions = updatedTest.questions.map(question => 
            question._id === id ? updatedQuestion : question
          );
          
          setCurrentTest(updatedTest);
        }
      }
      
      return updatedQuestion;
    } catch (error) {
      console.error('Error updating question:', error);
      setError(error.message || 'Ошибка при обновлении вопроса');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError, currentTest]);

  const deleteQuestion = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Deleting question ID:', id);
      await questionsApi.deleteQuestion(id);
      
      if (currentTest) {
        const updatedTest = JSON.parse(JSON.stringify(currentTest));
        
        if (updatedTest.questions) {
          updatedTest.questions = updatedTest.questions.filter(question => 
            question._id !== id
          );
          
          setCurrentTest(updatedTest);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      setError(error.message || 'Ошибка при удалении вопроса');
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearError, currentTest]);

  const checkAnswers = useCallback(async (testId, answers) => {
    try {
      setLoading(true);
      clearError();
      setAnswers(answers);
      
      console.log('Checking answers for test ID:', testId, 'with answers:', answers);
      const results = await testsApi.checkAnswers(testId, answers);
      console.log('Test results:', results);
      
      if (results) {
        results.answers = answers;
        setTestResults(results);
      }
      
      return results;
    } catch (error) {
      console.error('Error checking answers:', error);
      setError(error.message || 'Ошибка при проверке ответов');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const clearResults = useCallback(() => {
    setTestResults(null);
    setAnswers({});
  }, []);

  useEffect(() => {
    if (error) {
      console.error('TestContext error state:', error);
    }
  }, [error]);

  const contextValue = {
    tests,
    currentTest,
    loading,
    error,
    pagination,
    testResults,
    answers,
    fetchTests,
    fetchTestById,
    createTest,
    updateTest,
    deleteTest,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    checkAnswers,
    clearResults,
    clearError
  };

  return (
    <TestContext.Provider value={contextValue}>
      {children}
    </TestContext.Provider>
  );
};