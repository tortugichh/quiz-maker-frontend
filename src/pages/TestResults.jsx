import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';

const TestResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTestById, currentTest, loading, error, testResults, clearResults } = useTestContext();
  
  useEffect(() => {
    fetchTestById(id);
    
    return () => {
      clearResults();
    };
  }, [fetchTestById, id, clearResults]);
  
  useEffect(() => {
    if (!loading && !testResults && !error) {
      navigate(`/tests/${id}`);
    }
  }, [testResults, loading, error, navigate, id]);
  
  const getQuestionById = (questionId) => {
    if (!currentTest || !currentTest.questions) return null;
    return currentTest.questions.find((q) => q._id === questionId);
  };
  
  const formatUserAnswer = (question, answer) => {
    if (!question || answer === undefined) return 'Нет ответа';
    
    if (question.type === 'single') {
      return answer;
    } else if (question.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0
        ? answer.join(', ')
        : 'Нет выбранных вариантов';
    } else if (question.type === 'text') {
      return answer.trim() || 'Ответ не указан';
    }
    
    return 'Неизвестный формат ответа';
  };
  
  const formatCorrectAnswer = (question) => {
    if (!question) return '';
    
    if (question.type === 'single' || question.type === 'multiple') {
      return question.correctAnswers.join(', ');
    } else if (question.type === 'text') {
      return question.correctAnswerText;
    }
    
    return '';
  };
  
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };
  
  const getScoreColorClass = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
        <Link 
          to="/tests" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Вернуться к списку тестов
        </Link>
      </div>
    );
  }
  
  if (!currentTest || !testResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Результаты не доступны. Пройдите тест сначала.</h2>
        <Link 
          to={`/tests/${id}/take`} 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Пройти тест
        </Link>
      </div>
    );
  }
  
  const { summary, results } = testResults;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          to={`/tests/${id}`} 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-4"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к деталям теста
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentTest.title}</h1>
        <p className="text-lg text-gray-600">Результаты теста</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ваш результат</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Баллы</h3>
              <p className="text-4xl font-bold text-indigo-600">
                {summary.earnedPoints} / {summary.totalPoints}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Процент</h3>
              <p className={`text-4xl font-bold ${getScoreColorClass(summary.percentageScore)}`}>
                {summary.percentageScore}%
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Оценка</h3>
              <p className={`text-4xl font-bold ${getScoreColorClass(summary.percentageScore)}`}>
                {getGrade(summary.percentageScore)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Правильные ответы</h3>
              </div>
              <p className="text-4xl font-bold text-green-600">
                {summary.correctCount} <span className="text-lg text-gray-500">из {summary.totalQuestions}</span>
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Неправильные ответы</h3>
              </div>
              <p className="text-4xl font-bold text-red-600">
                {summary.incorrectCount} <span className="text-lg text-gray-500">из {summary.totalQuestions}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Детальные результаты</h2>
        
        <div className="space-y-6">
          {results.map((result, index) => {
            const question = getQuestionById(result.questionId);
            if (!question) return null;
            
            return (
              <div
                key={result.questionId}
                className={`bg-white shadow-md rounded-lg overflow-hidden`}
              >
                <div className={`px-6 py-4 flex items-center ${
                  result.correct ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'
                }`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    result.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {result.correct ? (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Вопрос {index + 1}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {result.correct ? 'Правильно' : 'Неправильно'} ({result.points} / {result.possiblePoints} баллов)
                    </p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="mb-6 text-gray-800 text-lg">{question.text}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Ваш ответ:</h4>
                      <div className={`py-2 px-3 border rounded-md ${
                        result.correct
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                      }`}>
                        {formatUserAnswer(question, testResults.answers?.[result.questionId])}
                      </div>
                    </div>
                    
                    {!result.correct && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Правильный ответ:</h4>
                        <div className="py-2 px-3 border border-green-500 bg-green-50 text-green-800 rounded-md">
                          {formatCorrectAnswer(question)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <Link 
          to={`/tests/${id}/take`} 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Пройти тест еще раз
        </Link>
        <Link 
          to="/tests" 
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Просмотреть другие тесты
        </Link>
      </div>
    </div>
  );
};

export default TestResults;