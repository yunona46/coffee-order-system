import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLogin, setCurrentView }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email обов\'язковий';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некоректний формат email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Пароль обов\'язковий';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль має містити мінімум 6 символів';
    }

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Ім\'я обов\'язкове';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Симуляція API запиту
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = {
        id: Date.now(),
        name: formData.name || 'Користувач',
        email: formData.email
      };

      onLogin(userData);
      setCurrentView('menu');
      
    } catch (error) {
      setErrors({ submit: 'Помилка входу. Спробуйте ще раз.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 1,
      name: 'Демо Користувач',
      email: 'demo@coffeeshop.com'
    };
    onLogin(demoUser);
    setCurrentView('menu');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищуємо помилку при вводі
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section className="auth" role="main" aria-labelledby="auth-title">
      <div className="auth-container">
        <div className="auth-form">
          <h2 id="auth-title">{isLogin ? 'Вхід в систему' : 'Реєстрація'}</h2>
          
          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Ім'я</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Введіть ваше ім'я"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" className="error-message" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Введіть ваш email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Введіть ваш пароль"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <span id="password-error" className="error-message" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {errors.submit && (
              <div className="error-message" role="alert">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isLoading}
              aria-describedby="submit-status"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                  <span id="submit-status">Обробка...</span>
                </>
              ) : (
                <span id="submit-status">{isLogin ? 'Увійти' : 'Зареєструватися'}</span>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>або</span>
          </div>

          <button
            className="btn btn-secondary btn-large"
            onClick={handleDemoLogin}
            aria-label="Увійти як демо користувач"
          >
            <i className="fas fa-rocket" aria-hidden="true"></i> Демо вхід
          </button>

          <div className="auth-switch">
            <p>
              {isLogin ? 'Немає акаунту?' : 'Вже маєте акаунт?'}
              <button
                type="button"
                className="link-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Зареєструватися' : 'Увійти'}
              </button>
            </p>
          </div>

          <button
            className="link-btn back-btn"
            onClick={() => setCurrentView('menu')}
            aria-label="Повернутися до меню"
          >
            ← Повернутись до меню
          </button>
        </div>
      </div>
    </section>
  );
};

export default Auth;