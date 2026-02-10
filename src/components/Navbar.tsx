import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import logo from "../assets/Copilot_20260210_193854.png";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/feed",
    label: "Feed",
  },
  {
    href: "/hotels",
    label: "Hotels",
  },
  {
    href: "/guest-houses",
    label: "Guest-Hs",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Link
              to="/"
              className="ml-2 font-bold text-xl flex items-center gap-2"
            >
              <img
                src={logo}
                alt="IRED Logo"
                className="h-10 w-auto object-contain"
                style={{ minWidth: "40px" }}
              />
              <span className="bg-gradient-to-r from-[#B8860B] to-[#F5C147] text-transparent bg-clip-text">
                IRED
              </span>
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2" asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu Icon</span>
                </Button>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    IRED
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Link
                      key={label}
                      to={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </Link>
                  ))}

                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className={`w-[110px] border ${buttonVariants({
                          variant: "secondary",
                        })}`}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className={`w-[110px] border ${buttonVariants({
                          variant: "default",
                        })}`}
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-[110px]"
                      variant="destructive"
                    >
                      Logout
                    </Button>
                  )}
                  {user && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Settings
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <Link
                to={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 items-center">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`border ${buttonVariants({ variant: "secondary" })}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`border ${buttonVariants({ variant: "default" })}`}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ""} alt={user.username} />
                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/feed">Feed</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
