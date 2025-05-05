import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
import TestCard from '../components/tests/TestCard';

const Home = () => {
  const { fetchTests, tests, loading, error, deleteTest } = useTestContext();
  const [recentTests, setRecentTests] = useState([]);

  useEffect(() => {
    fetchTests({ limit: 3 });
  }, [fetchTests]);

  useEffect(() => {
    if (tests) {
      setRecentTests(tests);
    }
  }, [tests]);

  const handleDelete = async (id) => {
    await deleteTest(id);
    fetchTests({ limit: 3 });
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-16 md:py-24 mb-16 rounded-bl-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Создавайте интерактивные тесты с QuizMaker
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Создавайте тесты с различными типами вопросов, назначайте баллы и получайте 
            мгновенные результаты. Идеально подходит для образования, обучения или просто для развлечения!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/tests/create" 
              className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Создать тест
            </Link>
            <Link 
              to="/tests" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Все тесты
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Ключевые особенности</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Почему стоит использовать QuizMaker для создания тестов
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center hover:-translate-y-2">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full text-indigo-600 mb-6">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Разные типы вопросов</h3>
              <p className="text-gray-600">
                Создавайте тесты с вопросами типа "один ответ", "множественный выбор" 
                и "текстовый ответ" для проверки различных типов знаний.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center hover:-translate-y-2">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full text-indigo-600 mb-6">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Мгновенные результаты</h3>
              <p className="text-gray-600">
                Получайте мгновенную обратную связь о результатах теста, включая счет, 
                правильные и неправильные ответы и общий процент выполнения.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center hover:-translate-y-2">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full text-indigo-600 mb-6">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Настраиваемые баллы</h3>
              <p className="text-gray-600">
                Назначайте различные баллы вопросам в зависимости от их сложности,
                что позволяет проводить взвешенное оценивание и более точную проверку знаний.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Недавние тесты</h2>
            <Link 
              to="/tests" 
              className="px-4 py-2 border border-indigo-600 text-indigo-600 font-medium rounded hover:bg-indigo-50 transition-colors"
            >
              Смотреть все
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <p>{error}</p>
            </div>
          ) : recentTests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">
                Тесты не найдены. Будьте первым, кто создаст тест!
              </p>
              <Link 
                to="/tests/create" 
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Создать тест
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentTests.map((test) => (
                <TestCard key={test._id} test={test} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 my-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы создать свой тест?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Начните создавать интерактивные тесты за считанные минуты с нашей удобной платформой.
          </p>
          <Link 
            to="/tests/create" 
            className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Начать сейчас
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;