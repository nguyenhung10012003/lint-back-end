const audioAccept = ['mp3', 'm4a', 'weba', 'ogg'];
const videoAccept = ['mp4', 'webm', 'flv', 'avi', 'mov', 'wmv'];
const imageAccept = [
  'jpeg',
  'png',
  'webp',
  'svg',
  'gif',
  'bmp',
  'ico',
  'tiff',
  'tif',
  'jpg',
  'jfif',
];
const fileAccept = audioAccept.concat(videoAccept, imageAccept);

export const audioAcceptReg = new RegExp(`.(${audioAccept.join('|')})$`);
export const videoAcceptReg = new RegExp(`.(${videoAccept.join('|')})$`);
export const imageAcceptReg = new RegExp(`.(${imageAccept.join('|')})$`);
export const fileAcceptReg = new RegExp(`.(${fileAccept.join('|')})$`);
