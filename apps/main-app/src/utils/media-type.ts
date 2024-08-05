export function getMediaType(
  mimeType: string,
): 'IMAGE' | 'VIDEO' | 'AUDIO' | 'UNKNOWN' {
  if (mimeType.startsWith('image/')) {
    return 'IMAGE';
  } else if (mimeType.startsWith('video/')) {
    return 'VIDEO';
  } else if (mimeType.startsWith('audio/')) {
    return 'AUDIO';
  } else {
    return 'UNKNOWN';
  }
}
