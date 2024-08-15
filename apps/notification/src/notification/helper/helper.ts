import * as Handlebars from 'handlebars';
import { Lang } from '@app/common/types/lang';
import { Content, Highlight } from '../dto/notification';
import { NotificationType } from '../types/notification.type';

const templates = {
  like: Handlebars.compile(
    '{{ subjectName }} đã thích bài viết của bạn{{#if diContent}}: "{{ diContent }}"{{/if}}',
  ),
  comment: Handlebars.compile(
    '{{ subjectName }} đã bình luận về bài viết của bạn{{#if diContent}}: "{{ diContent }}"{{/if}}',
  ),
  follow: Handlebars.compile('{{ subjectName }} đã theo dõi bạn'),
};

const translationDictionaries = [
  {},
  {
    ' đã bình luận về bài viết của bạn': ' commented on your post',
    ' đã thích bài viết của bạn': ' liked your post',
    ' đã theo dõi bạn': ' started following you',
    ' và': ' and',
    ' người khác': ' others',
  },
];

export const generateNotificationContent = (
  notificationType: NotificationType,
  subjectName: string,
  diContent: string,
) => {
  const data = {
    subjectName: subjectName,
    diContent:
      diContent && countWords(diContent) > 5
        ? getFirstWords(diContent, 5) + '...'
        : diContent,
  };

  let text = '';
  const highlights: Highlight[] = [];

  switch (notificationType) {
    case NotificationType.LIKE:
      text = templates.like(data);
      break;

    case NotificationType.COMMENT:
      text = templates.comment(data);
      break;

    case NotificationType.FOLLOW:
      text = templates.follow(data);
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
  if (language === 0) {
    return content;
  }
  const highlights = content.highlights;
  let translatedText = content.text.split(':')[0];
  const notTranslatedText = content.text.split(':')[1];

  for (const [key, value] of Object.entries(
    translationDictionaries[language],
  )) {
    const regex = new RegExp(key, 'g');
    translatedText = translatedText.replace(regex, value);
  }
  return {
    text: translatedText + ':' + notTranslatedText,
    highlights: highlights,
  };
}

export function generateUrl(type: number, id: string) {
  switch (type) {
    case NotificationType.LIKE:
      return `/post/${id}`;
    case NotificationType.COMMENT:
      return `/post/${id}`;
    case NotificationType.FOLLOW:
      return `/profile/${id}`;
    default:
      return '';
  }
}

export function getNotificationType(stringKey: string): NotificationType {
  switch (stringKey) {
    case 'like':
      return NotificationType.LIKE;
    case 'comment':
      return NotificationType.COMMENT;
    case 'follow':
      return NotificationType.FOLLOW;
    default:
      return NotificationType.OTHER;
  }
}

export function getFirstWords(text: string, numberOfWord: number): string {
  const words = text.split(' ');
  const firstWords = words.slice(0, numberOfWord).join(' ');
  return firstWords;
}

export function countWords(str: string): number {
  return str.trim().split(/\s+/).length;
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
