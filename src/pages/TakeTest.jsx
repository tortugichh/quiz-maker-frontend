import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTestById, currentTest, loading, error, checkAnswers } = useTestContext();
  
  const [answers, setAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchTestById(id);
  }, [fetchTestById, id]);
  
  useEffect(() => {
    if (currentTest && currentTest.questions) {
      const initialAnswers = {};
      const initialAnsweredQuestions = {};
      
      currentTest.questions.forEach((question) => {
        initialAnswers[question._id] = question.type === 'multiple' ? [] : '';
        initialAnsweredQuestions[question._id] = false;
      });
      
      setAnswers(initialAnswers);
      setAnsweredQuestions(initialAnsweredQuestions);
    }
  }, [currentTest]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
  
  if (!currentTest || !currentTest.questions || currentTest.questions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Тест не найден или не содержит вопросов</h2>
        <Link 
          to="/tests" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Вернуться к списку тестов
        </Link>
      </div>
    );
  }
  
  const currentQuestion = currentTest.questions[currentQuestionIndex];
  
  const handleSingleChoiceAnswer = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };
  
  const handleMultipleChoiceAnswer = (questionId, option, isChecked) => {
    setAnswers((prev) => {
      const currentAnswers = [...(prev[questionId] || [])];
      
      if (isChecked) {
        if (!currentAnswers.includes(option)) {
          currentAnswers.push(option);
        }
      } else {
        const index = currentAnswers.indexOf(option);
        if (index > -1) {
          currentAnswers.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        [questionId]: currentAnswers,
      };
    });
    
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: true, 
    }));
  };
  
  const handleTextAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: value.trim() !== '',
    }));
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowReview(true);
    }
  };
  
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowReview(false);
  };
  
  const calculateProgress = () => {
    const total = currentTest.questions.length;
    const answered = Object.values(answeredQuestions).filter(Boolean).length;
    return Math.round((answered / total) * 100);
  };
  
  const handleSubmit = async () => {
    if (window.confirm('Вы уверены, что хотите отправить свои ответы? После отправки вы не сможете внести изменения.')) {
      setIsSubmitting(true);
      
      try {
        await checkAnswers(id, answers);
        navigate(`/tests/${id}/results`);
      } catch (error) {
        console.error('Error submitting answers:', error);
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to={`/tests/${id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center mb-4">
          <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Выйти из теста
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{currentTest.title}</h1>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Прогресс</span>
          <span className="text-sm font-medium text-indigo-600">{calculateProgress()}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>
      
      {showReview ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Проверка ваших ответов</h2>
          
          <div className="mb-6 space-y-3">
            {currentTest.questions.map((question, index) => (
              <div 
                key={question._id} 
                className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => goToQuestion(index)}
              >
                <div 
                  className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    answeredQuestions[question._id]
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="truncate">
                  {question.text.length > 50
                    ? question.text.substring(0, 50) + '...'
                    : question.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              {Object.values(answeredQuestions).every(Boolean)
                ? 'Все вопросы были отвечены. Теперь вы можете отправить тест.'
                : 'Некоторые вопросы остались без ответа. Вы можете вернуться и ответить на них или отправить тест как есть.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Отправка...
                  </>
                ) : (
                  'Отправить тест'
                )}
              </button>
              
              <button
                onClick={() => setShowReview(false)}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Вернуться к вопросам
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Вопрос {currentQuestionIndex + 1} из {currentTest.questions.length}
            </h2>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'балл' : currentQuestion.points < 5 ? 'балла' : 'баллов'}
            </span>
          </div>
          
          <div className="px-6 py-8">
            <h3 className="text-xl font-medium text-gray-900 mb-6">{currentQuestion.text}</h3>
            
            {currentQuestion.type === 'single' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`py-3 px-4 border rounded-md cursor-pointer transition-colors ${
                      answers[currentQuestion._id] === option
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                    onClick={() => handleSingleChoiceAnswer(currentQuestion._id, option)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${
                        answers[currentQuestion._id] === option
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion._id] === option && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`py-3 px-4 border rounded-md cursor-pointer transition-colors ${
                      (answers[currentQuestion._id] || []).includes(option)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                    onClick={() => 
                      handleMultipleChoiceAnswer(
                        currentQuestion._id, 
                        option, 
                        !(answers[currentQuestion._id] || []).includes(option)
                      )
                    }
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center border ${
                        (answers[currentQuestion._id] || []).includes(option)
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}>
                        {(answers[currentQuestion._id] || []).includes(option) && (
                          <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'text' && (
              <div>
                <textarea
                  value={answers[currentQuestion._id] || ''}
                  onChange={(e) => handleTextAnswer(currentQuestion._id, e.target.value)}
                  placeholder="Введите ваш ответ..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            )}
          </div>
          
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={goToPrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Предыдущий
            </button>
            
            {currentQuestionIndex === currentTest.questions.length - 1 ? (
              <button
                onClick={() => setShowReview(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Просмотр ответов
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Следующий
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <p className="text-sm font-medium text-gray-700 mb-3">Навигация по вопросам:</p>
        <div className="flex flex-wrap gap-2">
          {currentTest.questions.map((question, index) => (
            <button
              key={question._id}
              onClick={() => goToQuestion(index)}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                currentQuestionIndex === index && !showReview
                  ? 'bg-indigo-600 text-white'
                  : answeredQuestions[question._id]
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={`Перейти к вопросу ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;