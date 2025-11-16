import { Link } from 'react-router-dom';
import { Search, Menu, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Input } from '../common/Input';

export function Header() {
  const { searchQuery, setSearchQuery, setSidebarOpen, sidebarOpen } = useStore();

  return (
    <header className="bg-dark-200 border-b border-dark-300 h-16 flex items-center px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4 w-full max-w-7xl mx-auto">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-dark-300 rounded transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-dark-100">
            AR
          </div>
          <span className="font-bold text-lg hidden sm:inline">
            Arc Raiders Helper
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search items, quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-dark-300 rounded transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
