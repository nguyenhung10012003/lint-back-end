import * as Handlebars from 'handlebars';

export const template = {
  like: Handlebars.compile(
    '{{ subjectName }} đã thích bài viết của bạn{{#if diContent}}: "{{ diContent }}"{{/if}}',
  ),
  comment: Handlebars.compile(
    '{{ subjectName }} đã bình luận về bài viết của bạn{{#if diContent}}: "{{ diContent }}"{{/if}}',
  ),
  follow: Handlebars.compile('{{ subjectName }} đã theo dõi bạn'),
  followRequest: Handlebars.compile(
    '{{ subjectName }} đã gửi yêu cầu theo dõi bạn',
  ),
};
