import { modifier } from 'ember-modifier';

export default modifier(function documentKeyboard(
  _,
  __,
  { onCharacter, onDelete, onEnter }
) {
  function handler({ key }) {
    if (key === 'Enter') onEnter();
    else if (key === 'Backspace') onDelete();
    else if (/^[a-zA-Z]$/.test(key)) onCharacter(key);
  }

  document.addEventListener('keydown', handler);

  return () => document.removeEventListener('keydown', handler);
});
