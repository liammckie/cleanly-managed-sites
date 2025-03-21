
/**
 * Check if a file is an image based on its extension
 */
export function isImageFile(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
  
  return imageExtensions.includes(extension);
}
