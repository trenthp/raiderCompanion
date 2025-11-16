import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Target, 
  ClipboardList, 
  Building2, 
  TreePine,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/loadout', icon: Package, label: 'Loadout' },
  { to: '/missions', icon: Target, label: 'Missions' },
  { to: '/resources', icon: ClipboardList, label: 'Resources' },
  { to: '/hideout', icon: Building2, label: 'Hideout' },
  { to: '/skills', icon: TreePine, label: 'Skills' },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useStore();

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className="fixed lg:sticky top-0 left-0 h-screen w-64 lg:w-20 bg-dark-200 border-r border-dark-300 flex flex-col z-50 lg:top-16 lg:h-[calc(100vh-4rem)]">
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-dark-300 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 group ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:bg-dark-300 hover:text-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="lg:hidden font-medium">{item.label}</span>
              
              {/* Tooltip for desktop */}
              <span className="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-dark-300 rounded text-sm whitespace-nowrap">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-300">
          <div className="text-xs text-gray-500 lg:text-center">
            <p className="lg:hidden">v1.0.0</p>
            <p className="lg:hidden mt-1">
              Data from{' '}
              <a 
                href="https://metaforge.app/arc-raiders" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                MetaForge
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
