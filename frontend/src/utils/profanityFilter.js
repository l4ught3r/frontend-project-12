import LeoProfanity from 'leo-profanity';

// Настройка фильтра
LeoProfanity.clearList(); // Очищаем стандартный список
LeoProfanity.add(LeoProfanity.getDictionary('en')); // Добавляем английский словарь
LeoProfanity.add(LeoProfanity.getDictionary('ru')); // Добавляем русский словарь

// Дополнительные слова для фильтрации (можно расширить)
const additionalBadWords = [
  // Добавьте дополнительные слова при необходимости
];

if (additionalBadWords.length > 0) {
  LeoProfanity.add(additionalBadWords);
}

/**
 * Фильтрует нецензурные слова в тексте
 * @param {string} text - Текст для фильтрации
 * @param {string} replacement - Символ замены (по умолчанию '*')
 * @returns {string} - Отфильтрованный текст
 */
export const filterProfanity = (text, replacement = '*') => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  return LeoProfanity.clean(text, replacement);
};

/**
 * Проверяет, содержит ли текст нецензурные слова
 * @param {string} text - Текст для проверки
 * @returns {boolean} - true, если содержит нецензурные слова
 */
export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  return LeoProfanity.check(text);
};

/**
 * Получает список найденных нецензурных слов
 * @param {string} text - Текст для анализа
 * @returns {Array} - Массив найденных нецензурных слов
 */
export const getProfanityWords = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  return LeoProfanity.list(text);
};

export default {
  filterProfanity,
  containsProfanity,
  getProfanityWords
}; 