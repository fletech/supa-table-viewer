
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ListChecks, Table, Archive, XCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  // Cerrar sidebar en navegación en móvil
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ease-in-out"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Botón de hamburguesa para móvil */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed left-4 top-4 z-50 p-2 rounded-md bg-primary text-white shadow-md"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out",
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0",
          className
        )}
      >
        <div className="h-full px-3 py-4 flex flex-col">
          <div className="mb-6 px-3 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="relative w-8 h-8 mr-2 overflow-hidden rounded-md bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Table className="h-5 w-5 text-primary" />
                </div>
              </div>
              <span className="text-xl font-semibold tracking-tight">
                WhApplied?
              </span>
            </Link>
          </div>

          <div className="px-3 mb-6">
            <Link to="/applications/new">
              <Button className="w-full gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </Link>
          </div>

          <nav className="space-y-1 flex-1">
            <NavItem 
              to="/" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={location.pathname === '/'}
            />
            <NavItem 
              to="/applications" 
              icon={<ListChecks className="h-5 w-5" />} 
              label="Actives" 
              isActive={location.pathname === '/applications'}
            />
            <NavItem 
              to="/overview" 
              icon={<Table className="h-5 w-5" />} 
              label="Overview" 
              isActive={location.pathname === '/overview'}
            />
            <div className="h-px bg-sidebar-border my-3" />
            <NavItem 
              to="/rejected" 
              icon={<XCircle className="h-5 w-5" />} 
              label="Rejected" 
              isActive={location.pathname === '/rejected'}
            />
            <NavItem 
              to="/archived" 
              icon={<Archive className="h-5 w-5" />} 
              label="Archived" 
              isActive={location.pathname === '/archived'}
            />
          </nav>

          <div className="mt-auto pt-4 border-t border-sidebar-border">
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default Sidebar;
