import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">QuizMaker</h3>
            <p className="text-gray-300 mb-4">
              Создавайте и проходите интерактивные тесты с различными типами вопросов, 
              назначайте баллы и получайте мгновенные результаты.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-gray-300 hover:text-white transition-colors">
                  Все тесты
                </Link>
              </li>
              <li>
                <Link to="/tests/create" className="text-gray-300 hover:text-white transition-colors">
                  Создать тест
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Типы вопросов</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Один ответ</li>
              <li className="text-gray-300">Множественный выбор</li>
              <li className="text-gray-300">Текстовый ответ</li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">О проекте</h3>
            <p className="text-gray-300 mb-2">
              QuizMaker — это веб-приложение, разработанное на стеке MERN 
              (MongoDB, Express.js, React + Vite, Node.js).
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} QuizMaker. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;