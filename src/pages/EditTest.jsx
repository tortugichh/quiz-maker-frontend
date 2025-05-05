import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
import QuestionForm from '../components/questions/QuestionForm';

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchTestById,
    currentTest,
    loading,
    error,
    updateTest,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  } = useTestContext();
  
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    tags: [],
  });
  
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('details'); 
  
  useEffect(() => {
    fetchTestById(id);
  }, [fetchTestById, id]);
  
  useEffect(() => {
    if (currentTest) {
      setTestData({
        title: currentTest.title || '',
        description: currentTest.description || '',
        tags: currentTest.tags || [],
      });
    }
  }, [currentTest]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    
    if (tagInput.trim()) {
      if (!testData.tags.includes(tagInput.trim())) {
        setTestData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(e);
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTestData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!testData.title.trim()) {
      errors.title = 'Название теста обязательно';
    } else if (testData.title.length > 100) {
      errors.title = 'Название теста не может быть длиннее 100 символов';
    }
    
    if (!testData.description.trim()) {
      errors.description = 'Описание теста обязательно';
    } else if (testData.description.length > 500) {
      errors.description = 'Описание теста не может быть длиннее 500 символов';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleTestSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await updateTest(id, testData);
  };
  
  const handleQuestionSubmit = async (questionData) => {
    if (editingQuestionId) {
      await updateQuestion(editingQuestionId, questionData);
      setEditingQuestionId(null);
    } else {
      await addQuestion(id, questionData);
    }
    
    setIsAddingQuestion(false);
  };
  
  const handleEditQuestion = (question) => {
    setEditingQuestionId(question._id);
    setIsAddingQuestion(true);
  };
  
  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      await deleteQuestion(questionId);
    }
  };
  
  const getQuestionTypeDisplay = (type) => {
    switch (type) {
      case 'single':
        return 'Один ответ';
      case 'multiple':
        return 'Множественный выбор';
      case 'text':
        return 'Текстовый ответ';
      default:
        return type;
    }
  };
  
  if (loading && !currentTest) {
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
  
  if (!currentTest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Тест не найден или был удален</h2>
        <Link 
          to="/tests" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Вернуться к списку тестов
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          to={`/tests/${id}`} 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-4"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к деталям теста
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Редактирование теста</h1>
        
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm`}
            >
              Детали теста
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`${
                activeTab === 'questions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm`}
            >
              Вопросы
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'details' ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleTestSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Название теста <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={testData.title}
                onChange={handleChange}
                placeholder="Введите название теста"
                className={`w-full px-3 py-2 border ${validationErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Описание теста <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={testData.description}
                onChange={handleChange}
                placeholder="Опишите ваш тест"
                rows={4}
                className={`w-full px-3 py-2 border ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              ></textarea>
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Теги (необязательно)
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Добавить тег"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Добавить
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Нажмите "Добавить" или клавишу Enter после каждого тега
              </p>
              
              {testData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {testData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 inline-flex text-indigo-400 hover:text-indigo-600 focus:outline-none"
                        aria-label={`Удалить тег ${tag}`}
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Сохранение...
                  </>
                ) : (
                  'Сохранить изменения'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {isAddingQuestion ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingQuestionId ? 'Редактирование вопроса' : 'Добавление нового вопроса'}
              </h2>
              <QuestionForm
                onSubmit={handleQuestionSubmit}
                initialData={
                  editingQuestionId
                    ? currentTest.questions.find((q) => q._id === editingQuestionId)
                    : null
                }
                isEditing={!!editingQuestionId}
              />
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingQuestion(false);
                    setEditingQuestionId(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Добавить новый вопрос
              </button>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Вопросы</h2>
            
            {!currentTest.questions || currentTest.questions.length === 0 ? (
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-500">
                  Пока нет вопросов. Нажмите кнопку "Добавить новый вопрос" выше.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentTest.questions.map((question, index) => (
                  <div key={question._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <span className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                          {index + 1}
                        </span>
                        <span>{getQuestionTypeDisplay(question.type)}</span>
                      </h3>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-3">
                          {question.points} {question.points === 1 ? 'балл' : question.points < 5 ? 'балла' : 'баллов'}
                        </span>
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 mr-1"
                          aria-label="Редактировать вопрос"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          aria-label="Удалить вопрос"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="mb-4 text-gray-800">{question.text}</p>

                      {(question.type === 'single' || question.type === 'multiple') && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Варианты ответов:</h4>
                          <ul className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <li
                                key={optIndex}
                                className={`py-2 px-3 border ${
                                  question.correctAnswers.includes(option)
                                    ? 'border-green-500 bg-green-50 text-green-800'
                                    : 'border-gray-300 text-gray-800'
                                } rounded-md`}
                              >
                                {option}
                                {question.correctAnswers.includes(option) && (
                                  <span className="ml-2 text-sm font-medium text-green-600">
                                    (Правильный ответ)
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {question.type === 'text' && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Правильный ответ:</h4>
                          <div className="py-2 px-3 border border-green-500 bg-green-50 text-green-800 rounded-md">
                            {question.correctAnswerText}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTest;