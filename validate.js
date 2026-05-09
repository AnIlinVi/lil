// Валидация формы "Предложить свой бит/клип"
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.back form');
  if (!form) return;

  // Убираем старый обработчик, который просто показывал alert
  form.removeAttribute('onsubmit');
  form.onsubmit = null;

  // Находим поля
  const nameInput = form.querySelector('input[placeholder="Имя"]');
  const emailInput = form.querySelector('input[placeholder="E-mail"]');
  const subjectInput = form.querySelector('input[placeholder="Тематика"]');

  // Вспомогательные функции для отображения/очистки ошибок
  function showError(input, message) {
    let errorSpan = input.parentNode.querySelector('.error-message');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'error-message';
      input.parentNode.insertBefore(errorSpan, input.nextSibling);
    }
    errorSpan.textContent = message;
    errorSpan.style.color = '#ff4d4d';
    errorSpan.style.fontSize = '12px';
    errorSpan.style.marginTop = '5px';
    errorSpan.style.display = 'block';
    input.classList.add('input-error');
  }

  function clearError(input) {
    const errorSpan = input.parentNode.querySelector('.error-message');
    if (errorSpan) errorSpan.remove();
    input.classList.remove('input-error');
  }

  // Проверка email
  function isValidEmail(email) {
    const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return re.test(email);
  }

  // Основная валидация
  function validateForm() {
    let isValid = true;

    // Очищаем предыдущие ошибки
    [nameInput, emailInput, subjectInput].forEach(inp => clearError(inp));

    const nameValue = nameInput.value.trim();
    if (nameValue === '') {
      showError(nameInput, 'Пожалуйста, введите имя');
      isValid = false;
    }

    const emailValue = emailInput.value.trim();
    if (emailValue === '') {
      showError(emailInput, 'Пожалуйста, введите E-mail');
      isValid = false;
    } else if (!isValidEmail(emailValue)) {
      showError(emailInput, 'Введите корректный E-mail (например, name@domain.com)');
      isValid = false;
    }

    const subjectValue = subjectInput.value.trim();
    if (subjectValue === '') {
      showError(subjectInput, 'Пожалуйста, укажите тематику');
      isValid = false;
    }

    return isValid;
  }

  // Обработчик отправки
  function onFormSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
      alert('Спасибо! Мы свяжемся с вами.');
      form.reset(); // очищаем поля
      // Дополнительно убираем ошибки, если они остались
      [nameInput, emailInput, subjectInput].forEach(inp => clearError(inp));
    }
  }

  form.addEventListener('submit', onFormSubmit);

  // Интерактивное удаление ошибки при вводе текста
  [nameInput, emailInput, subjectInput].forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });
});
