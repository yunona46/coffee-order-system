class MenuService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  async getMenu() {
    try {
      const response = await fetch(`${this.baseURL}/menu`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      // Fallback до локальних даних
      return [
        {
          id: 1,
          name: 'Капучино',
          description: 'Ароматна кава з молочною піною',
          price: 65,
          category: 'coffee',
          image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          available: true
        },
        {
          id: 2,
          name: 'Лате',
          description: 'Ніжна кава з великою кількістю молока',
          price: 70,
          category: 'coffee',
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          available: true
        },
        {
          id: 3,
          name: 'Еспресо',
          description: 'Класичний міцний еспресо',
          price: 50,
          category: 'coffee',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          available: true
        },
        {
          id: 4,
          name: 'Американо',
          description: 'Чорна кава з водою',
          price: 55,
          category: 'coffee',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          available: true
        }
      ];
    }
  }

  async getCategories() {
    return [
      { id: 'all', name: 'Всі товари', icon: '🍽️' },
      { id: 'coffee', name: 'Кава', icon: '☕' },
      { id: 'tea', name: 'Чай', icon: '🍵' },
      { id: 'dessert', name: 'Десерти', icon: '🍰' }
    ];
  }
}

export const menuService = new MenuService();