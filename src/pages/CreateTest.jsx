import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';

const CreateTest = () => {
  const navigate = useNavigate();
  const { createTest, loading, error, clearError } = useTestContext();
  
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) {
      clearError();
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    
    if (tagInput.trim()) {
      if (!testData.tags.includes(tagInput.trim())) {
        setTestData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
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
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const newTest = await createTest(testData);
    
    if (newTest) {
      navigate(`/tests/${newTest._id}/edit`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          to="/tests" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку тестов
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Создание нового теста</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          {/* Title */}
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
                  Создание...
                </>
              ) : (
                'Создать тест'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;