import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
import TestCard from '../components/tests/TestCard';

const TestsList = () => {
  const { fetchTests, tests, loading, error, pagination, deleteTest } = useTestContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTests({ page: currentPage });
  }, [fetchTests, currentPage]);

  useEffect(() => {
    if (tests && tests.length > 0) {
      const tags = tests.reduce((acc, test) => {
        if (test.tags && test.tags.length > 0) {
          test.tags.forEach(tag => {
            if (!acc.includes(tag)) {
              acc.push(tag);
            }
          });
        }
        return acc;
      }, []);
      
      setAvailableTags(tags);
    }
  }, [tests]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTests({ search: searchTerm, tag: selectedTag, page: 1 });
    setCurrentPage(1);
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    fetchTests({ search: searchTerm, tag, page: 1 });
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    await deleteTest(id);
    fetchTests({ 
      search: searchTerm, 
      tag: selectedTag, 
      page: currentPage 
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
      setCurrentPage(newPage);
      fetchTests({ 
        search: searchTerm, 
        tag: selectedTag, 
        page: newPage 
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setCurrentPage(1);
    fetchTests({ page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Все тесты</h1>
        <Link 
          to="/tests/create" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Создать тест
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Поиск
              </label>
              <input
                type="text"
                id="search"
                placeholder="Поиск по названию теста..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:w-1/4">
              <label htmlFor="tagFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Фильтр по тегу
              </label>
              <select
                id="tagFilter"
                value={selectedTag}
                onChange={handleTagChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Все теги</option>
                {availableTags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <button 
                type="submit" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Искать
              </button>
            </div>
          </div>
        </form>
        
        <div className="flex justify-end">
          <button 
            onClick={resetFilters} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Сбросить фильтры
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Тесты не найдены</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || selectedTag ? 'Попробуйте изменить параметры поиска или фильтры.' : 'Создайте свой первый тест!'}
          </p>
          <div className="mt-6">
            {searchTerm || selectedTag ? (
              <button 
                onClick={resetFilters} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Сбросить фильтры
              </button>
            ) : (
              <Link 
                to="/tests/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Создать тест
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tests.map((test) => (
              <TestCard key={test._id} test={test} onDelete={handleDelete} />
            ))}
          </div>

          {pagination.total > pagination.limit && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                    currentPage === 1
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Предыдущая</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {currentPage > 2 && (
                  <button
                    onClick={() => handlePageChange(1)}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    1
                  </button>
                )}
                
                {currentPage > 3 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}
                
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {currentPage - 1}
                  </button>
                )}
                
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600"
                  aria-current="page"
                >
                  {currentPage}
                </button>
                
                {currentPage < Math.ceil(pagination.total / pagination.limit) && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {currentPage + 1}
                  </button>
                )}
                
                {currentPage < Math.ceil(pagination.total / pagination.limit) - 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}
                
                {currentPage < Math.ceil(pagination.total / pagination.limit) - 1 && (
                  <button
                    onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.limit))}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {Math.ceil(pagination.total / pagination.limit)}
                  </button>
                )}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(pagination.total / pagination.limit)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                    currentPage === Math.ceil(pagination.total / pagination.limit)
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Следующая</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestsList;