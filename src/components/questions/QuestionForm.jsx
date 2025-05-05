import { useState, useEffect } from 'react';

const QuestionForm = ({ onSubmit, initialData, isEditing = false }) => {
  const [questionData, setQuestionData] = useState({
    type: 'single',
    text: '',
    options: ['', ''],
    correctAnswers: [],
    correctAnswerText: '',
    points: 1,
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setQuestionData({
        type: initialData.type || 'single',
        text: initialData.text || '',
        options: initialData.options || ['', ''],
        correctAnswers: initialData.correctAnswers || [],
        correctAnswerText: initialData.correctAnswerText || '',
        points: initialData.points || 1,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!isEditing) {
      setQuestionData({
        type: 'single',
        text: '',
        options: ['', ''],
        correctAnswers: [],
        correctAnswerText: '',
        points: 1,
      });
    }
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuestionData((prevData) => ({
      ...prevData,
      points: Math.max(1, value), 
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    
    setQuestionData((prevData) => ({
      ...prevData,
      options: newOptions,
    }));

    if (errors.options) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        options: '',
      }));
    }
  };

  const addOption = () => {
    setQuestionData((prevData) => ({
      ...prevData,
      options: [...prevData.options, ''],
    }));
  };

  const removeOption = (index) => {
    if (questionData.options.length <= 2) {
      return;
    }

    const newOptions = [...questionData.options];
    newOptions.splice(index, 1);
    
    const newCorrectAnswers = questionData.correctAnswers.filter(
      (answer) => answer !== questionData.options[index]
    );

    setQuestionData((prevData) => ({
      ...prevData,
      options: newOptions,
      correctAnswers: newCorrectAnswers,
    }));
  };

  const handleSingleCorrectAnswerChange = (e) => {
    const { value } = e.target;
    
    setQuestionData((prevData) => ({
      ...prevData,
      correctAnswers: [value],
    }));

    if (errors.correctAnswers) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        correctAnswers: '',
      }));
    }
  };

  const handleMultipleCorrectAnswersChange = (e) => {
    const { value, checked } = e.target;
    
    let newCorrectAnswers;
    if (checked) {
      newCorrectAnswers = [...questionData.correctAnswers, value];
    } else {
      newCorrectAnswers = questionData.correctAnswers.filter(
        (answer) => answer !== value
      );
    }
    
    setQuestionData((prevData) => ({
      ...prevData,
      correctAnswers: newCorrectAnswers,
    }));

    if (errors.correctAnswers) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        correctAnswers: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!questionData.text.trim()) {
      newErrors.text = 'Текст вопроса обязателен';
    }

    if (questionData.type === 'single' || questionData.type === 'multiple') {
      if (questionData.options.length < 2) {
        newErrors.options = 'Требуется минимум 2 варианта ответа';
      } else if (questionData.options.some((option) => !option.trim())) {
        newErrors.options = 'Все варианты ответа должны иметь содержание';
      }

      if (questionData.type === 'single' && questionData.correctAnswers.length !== 1) {
        newErrors.correctAnswers = 'Выберите один правильный ответ';
      } else if (questionData.type === 'multiple' && questionData.correctAnswers.length === 0) {
        newErrors.correctAnswers = 'Выберите хотя бы один правильный ответ';
      }
    } else if (questionData.type === 'text') {
      if (!questionData.correctAnswerText.trim()) {
        newErrors.correctAnswerText = 'Правильный ответ обязателен';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const questionToSubmit = {
        type: questionData.type,
        text: questionData.text,
        points: questionData.points,
      };

      if (questionData.type === 'single' || questionData.type === 'multiple') {
        questionToSubmit.options = questionData.options;
        questionToSubmit.correctAnswers = questionData.correctAnswers;
      } else if (questionData.type === 'text') {
        questionToSubmit.correctAnswerText = questionData.correctAnswerText;
      }

      onSubmit(questionToSubmit);

      if (!isEditing) {
        setQuestionData({
          type: 'single',
          text: '',
          options: ['', ''],
          correctAnswers: [],
          correctAnswerText: '',
          points: 1,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Тип вопроса
        </label>
        <select
          id="type"
          name="type"
          value={questionData.type}
          onChange={handleChange}
          disabled={isEditing}
          className={`w-full px-3 py-2 border ${isEditing ? 'bg-gray-100' : 'bg-white'} border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="single">Один ответ</option>
          <option value="multiple">Множественный выбор</option>
          <option value="text">Текстовый ответ</option>
        </select>
        {isEditing && (
          <p className="mt-1 text-sm text-blue-600">
            Тип вопроса нельзя изменить при редактировании. Создайте новый вопрос вместо этого.
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
          Текст вопроса
        </label>
        <textarea
          id="text"
          name="text"
          value={questionData.text}
          onChange={handleChange}
          placeholder="Введите ваш вопрос здесь..."
          rows={3}
          className={`w-full px-3 py-2 border ${errors.text ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
        ></textarea>
        {errors.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
          Баллы (1-10)
        </label>
        <input
          type="number"
          id="points"
          name="points"
          value={questionData.points}
          onChange={handlePointsChange}
          min={1}
          max={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {(questionData.type === 'single' || questionData.type === 'multiple') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Варианты ответов
          </label>
          {errors.options && (
            <p className="mt-1 mb-2 text-sm text-red-600">{errors.options}</p>
          )}
          
          <div className="space-y-3 mb-4">
            {questionData.options.map((option, index) => (
              <div key={index} className="flex items-center border border-gray-200 p-3 rounded-md bg-white">
                <div className="mr-3">
                  {questionData.type === 'single' ? (
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="correctSingleAnswer"
                      value={option}
                      checked={questionData.correctAnswers.includes(option)}
                      onChange={handleSingleCorrectAnswerChange}
                      disabled={!option.trim()}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id={`option-${index}`}
                      value={option}
                      checked={questionData.correctAnswers.includes(option)}
                      onChange={handleMultipleCorrectAnswersChange}
                      disabled={!option.trim()}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  )}
                </div>
                
                <div className="flex-grow">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Вариант ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  disabled={questionData.options.length <= 2}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addOption}
            className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить вариант
          </button>
          
          {errors.correctAnswers && (
            <p className="mt-2 text-sm text-red-600">{errors.correctAnswers}</p>
          )}
        </div>
      )}

      {questionData.type === 'text' && (
        <div className="mb-6">
          <label htmlFor="correctAnswerText" className="block text-sm font-medium text-gray-700 mb-2">
            Правильный ответ
          </label>
          <input
            type="text"
            id="correctAnswerText"
            name="correctAnswerText"
            value={questionData.correctAnswerText}
            onChange={handleChange}
            placeholder="Введите правильный ответ"
            className={`w-full px-3 py-2 border ${errors.correctAnswerText ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.correctAnswerText && (
            <p className="mt-1 text-sm text-red-600">{errors.correctAnswerText}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Примечание: Ответы будут сравниваться без учета регистра.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Обновить вопрос' : 'Добавить вопрос'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;