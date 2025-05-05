import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTestById, currentTest, loading, error, deleteTest, deleteQuestion } = useTestContext();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchTestById(id);
  }, [fetchTestById, id]);

  const handleDeleteTest = async () => {
    if (confirmDelete) {
      const success = await deleteTest(id);
      if (success) {
        navigate('/tests');
      }
    } else {
      setConfirmDelete(true);
      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
    }
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
      <div className="mb-8">
        <Link 
          to="/tests" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-4"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку тестов
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{currentTest.title}</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Описание</h2>
          <p className="text-gray-700">{currentTest.description}</p>
        </div>

        {currentTest.tags && currentTest.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Теги</h3>
            <div className="flex flex-wrap gap-2">
              {currentTest.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Информация</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700">
                {currentTest.questions ? currentTest.questions.length : 0} вопрос(ов)
              </p>
            </div>
            <div className="flex items-center">
              <svg className="h-6 w-6 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700">
                {currentTest.questions ? currentTest.questions.reduce((total, q) => total + (q.points || 1), 0) : 0} балл(ов)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link 
            to={`/tests/${id}/take`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Пройти тест
          </Link>
          <Link 
            to={`/tests/${id}/edit`} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Редактировать тест
          </Link>
          <button
            onClick={handleDeleteTest}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              confirmDelete 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
            }`}
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {confirmDelete ? 'Подтвердить удаление' : 'Удалить тест'}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Вопросы</h2>
          <Link 
            to={`/tests/${id}/edit`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить/редактировать вопросы
          </Link>
        </div>

        {!currentTest.questions || currentTest.questions.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-500">
              Пока нет вопросов. Нажмите кнопку выше, чтобы добавить вопросы.
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
  );
};

export default TestDetails;