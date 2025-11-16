import type { Item } from '../../types';

interface ItemCardProps {
  item: Item;
  onSelect?: (item: Item) => void;
  selected?: boolean;
  showStats?: boolean;
  className?: string;
}

function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'legendary': return 'bg-orange-500 text-white';
    case 'epic': return 'bg-purple-500 text-white';
    case 'rare': return 'bg-blue-500 text-white';
    case 'uncommon': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

export function ItemCard({ 
  item, 
  onSelect, 
  selected = false, 
  showStats = true,
  className = ''
}: ItemCardProps) {
  return (
    <div 
      className={`card cursor-pointer hover:border-primary transition-all duration-200 ${
        selected ? 'border-primary ring-2 ring-primary/50' : 'border-dark-300'
      } ${className}`}
      onClick={() => onSelect?.(item)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-dark-300 rounded overflow-hidden mb-3">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <span className="text-4xl">?</span>
          </div>
        )}
        
        {/* Rarity Badge */}
        <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getRarityColor(item.rarity)}`}>
          {item.rarity}
        </span>
      </div>
      
      {/* Item Info */}
      <div>
        <h3 className="font-semibold text-sm mb-1 line-clamp-1" title={item.name}>
          {item.name}
        </h3>
        
        <p className="text-gray-400 text-xs line-clamp-2 mb-2" title={item.description}>
          {item.description}
        </p>
        
        {showStats && (
          <div className="flex flex-wrap gap-2 text-xs">
            {item.stats?.damage && (
              <div className="bg-dark-400 px-2 py-1 rounded">
                <span className="text-gray-400">DMG:</span>{' '}
                <span className="text-primary font-semibold">{item.stats.damage}</span>
              </div>
            )}
            
            <div className="bg-dark-400 px-2 py-1 rounded">
              <span className="text-gray-400">Weight:</span>{' '}
              <span className="text-gray-100 font-semibold">{item.weight}kg</span>
            </div>
            
            {item.value && (
              <div className="bg-dark-400 px-2 py-1 rounded">
                <span className="text-gray-400">Value:</span>{' '}
                <span className="text-success font-semibold">{item.value}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
