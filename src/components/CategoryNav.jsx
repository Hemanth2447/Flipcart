import React from 'react';
import { 
  Sparkles, Home, Smartphone, Laptop, Shirt, Tv, Sparkle, Gamepad2 
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

const iconMap = {
  Sparkles: Sparkles,
  Home: Home,
  Smartphone: Smartphone,
  Laptop: Laptop,
  Shirt: Shirt,
  Tv: Tv,
  Sparkle: Sparkle,
  Gamepad2: Gamepad2
};

export default function CategoryNav({ activeCategory, setActiveCategory }) {
  return (
    <div className="fk-cat-nav-wrapper">
      <div className="fk-cat-nav-container">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`fk-cat-item ${isActive ? 'active' : ''}`}
            >
              <div className={`fk-cat-icon-box ${isActive ? 'active-box' : ''}`}>
                <IconComponent size={22} className={isActive ? 'text-blue-600' : 'text-gray-600'} />
              </div>
              <span className="fk-cat-label">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
