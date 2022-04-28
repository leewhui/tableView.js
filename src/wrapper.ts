export function createWrapper(): HTMLDivElement {
  const div = document.createElement('div');
  div.style.width = '0px';
  div.style.height = '0px';
  div.style.position = 'absolute';
  div.style.outline = 'none';
  div.style.border = 'none';
  div.style.boxSizing = 'border-box';
  return div;
}