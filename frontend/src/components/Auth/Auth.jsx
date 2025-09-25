import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Демо авторизація - в реальному додатку буде API запит
    const userData = {
      id: 1,
      name: formData.name || 'Користувач',
      email: formData.email
    };
    
    login(userData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth">
      <div className="auth-form">
        <h2>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Ім'я</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше ім'я"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-large">
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>
        
        <div className="auth-switch">
          <button 
            className="link-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Ще не зареєстровані? Створіть акаунт' : 'Вже є акаунт? Увійти'}
          </button>
        </div>

        <div className="demo-credentials">
          <p><strong>Демо доступ:</strong></p>
          <p>Email: demo@example.com</p>
          <p>Пароль: будь-який</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
