import { Link, useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink } from "./ui/navigation-menu";
import { AuthUser, useAuthStore } from "../stores/useAuthStore";
import { useEffect, useState } from "react";
import React from "react";

function Navbar() {
  const { getCurrentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const initUser = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };
    
    initUser();
    
    const interval = setInterval(() => {
      const currentUser = getCurrentUser();
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUser(currentUser);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV === 'development') {
    console.log('Current user:', user);
  }

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate("/");
  };


  return (
    <nav className="bg-slate-800 p-4 shadow-md">
      <NavigationMenu className="max-w-screen-xl mx-auto">
        <NavigationMenuList className="flex justify-between items-center">
          <div className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-blue-300">
                Contacts
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white absolute z-50 min-w-[400px] rounded-md border shadow-lg">
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem to="/contacts" title="Contact Management">
                    View and manage your contact list
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-blue-300">
                  Administration
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[400px] gap-3 p-4">
                    <ListItem to="/users" title="User Management">
                      Manage system users and their permissions
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </div>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-white hover:text-blue-300">
              {user?.firstName} {user?.lastName}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white data-[side=bottom]:slide-in-from-top-2 data-[side=right]:slide-in-from-left-2">
              <ul className="grid w-[400px] gap-3 p-4">
                <ListItem 
                  to="/"
                  title="Logout" 
                  onClick={handleLogout}
                >
                  Sign out of your account
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { to: string; title: string }
>(({ title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          to={to}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
