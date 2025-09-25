import React from 'react';
import './Menu.css';

const Menu = () => {
    const coffeeItems = [
        { id: 1, name: "Еспресо", price: 25, description: "Класичний міцний кава" },
        { id: 2, name: "Капучино", price: 35, description: "З піною та молоком" },
        { id: 3, name: "Лате", price: 40, description: "Ніжний кава з молоком" }
    ];

    return (
        <div className="menu">
            <h2>☕ Меню кави</h2>
            <div className="coffee-list">
                {coffeeItems.map(coffee => (
                    <div key={coffee.id} className="coffee-item">
                        <h3>{coffee.name}</h3>
                        <p>{coffee.description}</p>
                        <span className="price">{coffee.price} грн</span>
                        <button>Додати до кошика</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
