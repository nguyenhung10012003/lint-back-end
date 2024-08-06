import * as Handlebars from 'handlebars';
import { Lang } from '../types/lang';
import { Highlight } from '../dto/notification';
import { NotificationType } from '../types/notification.type';

Handlebars.registerHelper('gt', function (a: number, b: number) {
  return a > b;
});

Handlebars.registerHelper('subtract', function (a: number, b: number) {
  return a - b;
});

const templates = {
  like: Handlebars.compile(
    '{{ subjectName }}{{#if (gt subjectCount 1) }} và {{ subtract subjectCount 1 }} người khác{{/if}} đã thích bài viết của bạn: "{{ diContent }}"',
  ),
  comment: Handlebars.compile(
    '{{ subjectName }}{{#if (gt subjectCount 1) }} và {{ subtract subjectCount 1 }} người khác{{/if}} đã bình luận về bài viết của bạn: "{{ diContent }}"',
  ),
  follow: Handlebars.compile('{{ subjectName }} đã theo dõi bạn'),
};

const translationDictionaries = [
  {}, // Vietnamese
  {
    ' đã bình luận về bài viết của bạn': ' commented on your post',
    ' đã thích bài viết của bạn': ' liked your post',
    ' đã theo dõi bạn': ' started following you',
    ' và': ' and',
    ' người khác': ' others',
  },
];

export const generateNotificationContent = (
  subjectName: string,
  subjectCount: number,
  notificationType: number,
  diContent: string,
) => {
  const data = {
    subjectName: subjectName,
    subjectCount: subjectCount,
    diContent:
      diContent && countWords(diContent) > 5
        ? getFirstWords(diContent, 5) + '...'
        : diContent,
  };

  let text = '';
  const highlights: Highlight[] = [];

  switch (notificationType) {
    case 1:
      text = templates.like(data);
      break;

    case 2:
      text = templates.comment(data);
      break;

    case 3:
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

export function updateContentOnLanguage(language: Lang, content: any) {
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

export function generateUrl(type: number, id?: string) {
  switch (type) {
    case 1:
      return `/post/${id}`;
    case 2:
      return `/post/${id}`;
    case 3:
      return `/profile/${id}`;
    default:
      return '';
  }
}

export function getNotificationType(stringKey: string): NotificationType {
  switch (stringKey) {
    case 'like':
      return 1;
    case 'comment':
      return 2;
    case 'follow':
      return 3;
    default:
      return 0;
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
