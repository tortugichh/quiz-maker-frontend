import { Link } from 'react-router-dom';

const TestCard = ({ test, onDelete }) => {
  if (!test || !test._id) {
    console.error('TestCard получил некорректные данные:', test);
    return null;
  }

  const { _id, title, description, tags, createdAt } = test;
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
      return 'Неизвестная дата';
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      onDelete(_id);
    }
  };
  
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title || 'Без названия'}</h3>
        
        <p className="text-gray-600 mb-4">{truncateDescription(description) || 'Без описания'}</p>
        
        {/* Теги */}
        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-sm text-gray-500">
          Создан: {formatDate(createdAt)}
        </p>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <Link 
            to={`/tests/${_id}`} 
            className="flex-grow px-4 py-2 border border-indigo-600 text-indigo-600 text-center font-medium rounded hover:bg-indigo-50 transition-colors"
          >
            Подробнее
          </Link>
          
          <Link 
            to={`/tests/${_id}/take`} 
            className="flex-grow px-4 py-2 bg-indigo-600 text-white text-center font-medium rounded hover:bg-indigo-700 transition-colors"
          >
            Пройти тест
          </Link>
          
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
            aria-label="Удалить тест"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCard;