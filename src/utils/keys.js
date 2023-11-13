export const disableTab = () => {
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Tab') {
      evt.preventDefault();
    }
  });
}