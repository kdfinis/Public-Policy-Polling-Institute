import { Home, Search, Bell, User, Grid3x3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  language: 'en' | 'hr';
}

export function BottomNav({ language }: BottomNavProps) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: language === 'en' ? 'Home' : 'Naslovnica' },
    { path: '/browse', icon: Grid3x3, label: language === 'en' ? 'Browse' : 'Pretraži' },
    { path: '/search', icon: Search, label: language === 'en' ? 'Search' : 'Traži' },
    { path: '/notifications', icon: Bell, label: language === 'en' ? 'Notifications' : 'Obavijesti' },
    { path: '/profile', icon: User, label: language === 'en' ? 'Profile' : 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
