import LeoProfanity from 'leo-profanity';

LeoProfanity.clearList();
LeoProfanity.add(LeoProfanity.getDictionary('en'));
LeoProfanity.add(LeoProfanity.getDictionary('ru'));

export const filterProfanity = (text, replacement = '*') => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  return LeoProfanity.clean(text, replacement);
};

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return LeoProfanity.check(text);
};

export const getProfanityWords = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  return LeoProfanity.list(text);
};
