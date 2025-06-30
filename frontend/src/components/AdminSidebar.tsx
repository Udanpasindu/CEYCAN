import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Settings, 
  Users, 
  BarChart3,
  Menu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getCategories } from '@/services/api';
import { Spinner } from '@/components/ui/spinner';

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/admin", 
    icon: Home,
    superAdminOnly: false
  },
  { 
    title: "Categories", 
    url: "/admin/categories", 
    icon: Package,
    superAdminOnly: false
  },
  { 
    title: "Products", 
    url: "/admin/products", 
    icon: Package,
    hasSubmenu: true,
    superAdminOnly: false
  },
  
  { 
    title: "Settings", 
    url: "/admin/settings", 
    icon: Settings,
    superAdminOnly: false
  }
];

// Import Category type
import { Category } from '@/services/api';

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth(); // Get user from auth context
  const currentPath = location.pathname;
  const [expandedMenu, setExpandedMenu] = useState<string | null>(
    currentPath.includes('/admin/products') ? 'Products' : null
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a useEffect to refresh categories when the component mounts
  useEffect(() => {
    fetchCategories();
    // We don't need to call it again when expandedMenu changes
    // as we'll use the cached data
  }, []);

  // Only fetch if categories are empty and menu is expanded
  useEffect(() => {
    if (expandedMenu === 'Products' && categories.length === 0) {
      fetchCategories();
    }
  }, [expandedMenu, categories.length]);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };
  
  const getNavClasses = (isActiveLink: boolean) =>
    `w-full justify-start transition-all duration-200 ${
      isActiveLink 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    }`;

  const toggleSubmenu = (title: string) => {
    setExpandedMenu(prev => prev === title ? null : title);
  };

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-64"} transition-all duration-300 ease-in-out border-r border-sidebar-border`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-lg">
            <img src="/favicon.ico" alt="Ceycan Agro" className="h-5 w-5" />
          </div>
          {state !== "collapsed" && (
            <span className="font-bold text-lg text-sidebar-foreground">CeyCan Admin</span>
          )}
        </div>
        <SidebarMenuButton className="text-sidebar-foreground hover:text-sidebar-accent-foreground" />
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider">
            {state !== "collapsed" ? "Navigation" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems
                // Filter items based on user role
                .filter(item => !item.superAdminOnly || (user?.role === 'super_admin'))
                .map((item) => {
                  const IconComponent = item.icon;
                  const isActiveLink = isActive(item.url);
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      {item.hasSubmenu ? (
                        <div>
                          <div
                            onClick={() => toggleSubmenu(item.title)}
                            className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                              isActiveLink 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            <IconComponent className="h-4 w-4 flex-shrink-0" />
                            {state !== "collapsed" && (
                              <>
                                <span className="ml-3 truncate flex-grow">{item.title}</span>
                                {expandedMenu === item.title ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </>
                            )}
                          </div>
                          
                          {state !== "collapsed" && expandedMenu === item.title && (
                            <div className="ml-6 mt-1 space-y-1 flex flex-col">
                              <NavLink 
                                to={item.url} 
                                className={`${getNavClasses(currentPath === item.url)} px-3 py-2 rounded-md flex items-center`}
                              >
                                <span className="text-sm">All Products</span>
                              </NavLink>
                              
                              {loading ? (
                                <div className="flex items-center py-2 px-3">
                                  <Spinner size="sm" />
                                  <span className="ml-2 text-xs">Loading...</span>
                                </div>
                              ) : (
                                categories.map(category => (
                                  <NavLink 
                                    key={category._id}
                                    to={`/admin/products/category/${category._id}`}
                                    className={`${getNavClasses(
                                      currentPath === `/admin/products/category/${category._id}`
                                    )} px-3 py-2 rounded-md flex items-center w-full`}
                                  >
                                    <span className="text-sm truncate">{category.name}</span>
                                  </NavLink>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url} 
                            end={item.url === "/admin"}
                            className={getNavClasses(isActiveLink)}
                          >
                            <IconComponent className="h-4 w-4 flex-shrink-0" />
                            {state !== "collapsed" && (
                              <span className="ml-3 truncate">{item.title}</span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
