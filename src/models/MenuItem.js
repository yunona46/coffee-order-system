// In-memory menu items storage
let menuItems = [];
let currentId = 1;

class MenuItem {
    constructor(data) {
        this.id = data.id || currentId++;
        this.name = data.name;
        this.description = data.description;
        this.category = data.category; // espresso, americano, latte, cappuccino, frappuccino
        this.price = data.price;
        this.sizes = data.sizes || [
            { name: 'Маленький', volume: '250ml', price: data.price },
            { name: 'Середній', volume: '350ml', price: data.price + 10 },
            { name: 'Великий', volume: '450ml', price: data.price + 20 }
        ];
        this.ingredients = data.ingredients || [];
        this.allergens = data.allergens || [];
        this.calories = data.calories || 0;
        this.available = data.available !== undefined ? data.available : true;
        this.preparationTime = data.preparationTime || 3;
        this.image = data.image || '/images/default.jpg';
        this.popularity = data.popularity || 0;
        this.nutritionalInfo = data.nutritionalInfo || {
            protein: 0, fat: 0, carbs: 0, sugar: 0
        };
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    // Save menu item to memory
    save() {
        const existingIndex = menuItems.findIndex(m => m.id === this.id);
        if (existingIndex >= 0) {
            menuItems[existingIndex] = this;
        } else {
            menuItems.push(this);
        }
        return this;
    }

    // Find by ID
    static findById(id) {
        return menuItems.find(m => m.id === id);
    }

    // Find all with filtering and pagination
    static findAll(options = {}) {
        let filteredItems = [...menuItems];
        
        // Filter by category
        if (options.category) {
            filteredItems = filteredItems.filter(m => m.category === options.category);
        }
        
        // Filter by availability
        if (options.available !== undefined) {
            filteredItems = filteredItems.filter(m => m.available === options.available);
        }
        
        // Filter by price range
        if (options.minPrice !== undefined) {
            filteredItems = filteredItems.filter(m => m.price >= options.minPrice);
        }
        if (options.maxPrice !== undefined) {
            filteredItems = filteredItems.filter(m => m.price <= options.maxPrice);
        }
        
        // Sort items
        if (options.sortBy) {
            switch (options.sortBy) {
                case 'price_asc':
                    filteredItems.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    filteredItems.sort((a, b) => b.price - a.price);
                    break;
                case 'name_asc':
                    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'popularity':
                    filteredItems.sort((a, b) => b.popularity - a.popularity);
                    break;
            }
        }
        
        // Pagination
        const page = options.page || 1;
        const limit = options.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = filteredItems.slice(startIndex, endIndex);
        
        return {
            items: paginatedItems,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredItems.length / limit),
                totalItems: filteredItems.length,
                itemsPerPage: limit,
                hasNextPage: endIndex < filteredItems.length,
                hasPrevPage: startIndex > 0
            }
        };
    }

    // Delete menu item
    static deleteById(id) {
        menuItems = menuItems.filter(m => m.id !== id);
        return true;
    }
}

// Create sample menu items
new MenuItem({
    name: 'Еспресо',
    description: 'Класичний міцний еспресо',
    category: 'espresso',
    price: 35,
    ingredients: ['еспресо'],
    calories: 5,
    popularity: 90
}).save();

new MenuItem({
    name: 'Американо',
    description: 'Еспресо з гарячою водою',
    category: 'americano',
    price: 40,
    ingredients: ['еспресо', 'вода'],
    calories: 10,
    popularity: 85
}).save();

new MenuItem({
    name: 'Класичний Латте',
    description: 'Ніжний напій з еспресо та молочною пінкою',
    category: 'latte',
    price: 45,
    ingredients: ['еспресо', 'молоко', 'молочна пінка'],
    allergens: ['молоко'],
    calories: 150,
    popularity: 95
}).save();

new MenuItem({
    name: 'Капучино',
    description: 'Ідеальний баланс еспресо, молока та пінки',
    category: 'cappuccino',
    price: 45,
    ingredients: ['еспресо', 'молоко', 'пінка'],
    allergens: ['молоко'],
    calories: 120,
    popularity: 88
}).save();

module.exports = MenuItem;
