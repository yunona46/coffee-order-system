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
    
    // ���� ����������� - � ��������� ������� ���� API �����
    const userData = {
      id: 1,
      name: formData.name || '����������',
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
        <h2>{isLogin ? '����' : '���������'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>��'�</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="���� ��'�"
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
            <label>������</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="��������"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-large">
            {isLogin ? '�����' : '��������������'}
          </button>
        </form>
        
        <div className="auth-switch">
          <button 
            className="link-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '�� �� �����������? ������� ������' : '��� � ������? �����'}
          </button>
        </div>

        <div className="demo-credentials">
          <p><strong>���� ������:</strong></p>
          <p>Email: demo@example.com</p>
          <p>������: ����-����</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
