import { Lang } from '../types/lang';
import { Content, Highlight } from '../dto/notification';
import { template } from './template';
import { dictionary } from './dictionary';
import { $Enums } from '@prisma/prisma-notification-client';

export const generateNotificationContent = (
  type: $Enums.NotificationType,
  subjectName: string,
  diContent: string,
) => {
  const data = {
    subjectName: subjectName,
    diContent:
      diContent && diContent.length > 30
        ? diContent.substring(0, 30) + '...'
        : diContent,
  };

  let text = '';
  const highlights: Highlight[] = [];

  switch (type) {
    case 'LIKE':
      text = template.like(data);
      break;

    case 'COMMENT':
      text = template.comment(data);
      break;

    case 'FOLLOW':
      text = template.follow(data);
      break;
    case 'FOLLOW_REQUEST':
      text = template.followRequest(data);
      break;

    default:
      text = '';
  }

  const offset = text.indexOf(subjectName);
  highlights.push({
    length: subjectName.length,
    offset: offset,
  });

  return {
    text: text,
    highlights: highlights,
  };
};

export function updateContentOnLanguage(language: Lang, content: Content) {
  if (language === Lang.VI) {
    return content;
  }
  const highlights = content.highlights;
  let translatedText = content.text.split(':')[0];
  const notTranslatedText = content.text.split(':')[1];

  for (const [key, value] of Object.entries(dictionary[language])) {
    const regex = new RegExp(key, 'g');
    translatedText = translatedText.replace(regex, value);
  }
  const text = notTranslatedText
    ? translatedText + ':' + notTranslatedText
    : translatedText;
  return {
    text: text,
    highlights: highlights,
  };
}

export function generateUrl(type: $Enums.NotificationType, id: string) {
  switch (type) {
    case 'LIKE':
      return `/post/${id}`;
    case 'COMMENT':
      return `/post/${id}`;
    case 'FOLLOW':
      return `/profile/${id}`;
    case 'FOLLOW_REQUEST':
      return `/profile/${id}`;
    default:
      return '';
  }
}

export function getFirstWords(text: string, numberOfWord: number): string {
  const words = text.split(' ');
  const firstWords = words.slice(0, numberOfWord).join(' ');
  return firstWords;
}

export function updateSubject(content: Content, subjectCount: number) {
  const subject = content.text.substring(
    content.highlights[0].offset,
    content.highlights[0].length,
  );
  const replaceSubject =
    subject + (subjectCount > 2 ? ' và những người khác' : ' và 1 người khác');
  content.text = content.text.replace(subject, replaceSubject);
  return content;
}
