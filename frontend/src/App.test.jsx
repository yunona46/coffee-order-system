import { render, screen } from '@testing-library/react';
import App from './App';

// Mock для контекстів, щоб уникнути помилок
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false }),
  AuthProvider: ({ children }) => children
}));

jest.mock('./contexts/CartContext', () => ({
  useCart: () => ({ items: [], total: 0, itemsCount: 0 }),
  CartProvider: ({ children }) => children
}));

test('renders coffee shop header', () => {
  render(<App />);
  const headerElement = screen.getByText(/CoffeeShop/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders menu link', () => {
  render(<App />);
  const menuLink = screen.getByText(/Меню/i);
  expect(menuLink).toBeInTheDocument();
});
