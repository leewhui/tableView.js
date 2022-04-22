export function createWrapper(): HTMLDivElement {
  const div = document.createElement('div');
  div.style.width = '100%';
  div.style.height = '100%';
  div.contentEditable = 'true';

  return div;
}