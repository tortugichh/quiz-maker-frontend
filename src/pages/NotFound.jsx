import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 py-16">
      <svg
        className="w-24 h-24 text-indigo-600 mb-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Страница не найдена</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;