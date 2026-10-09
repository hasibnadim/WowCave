"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [{ href: "/caves", label: "Caves" }];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user, status, loading, logout } = useAuth();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logout();
    }
  };

  return (
    <header className={cn(
      "z-50",
      isHome
        ? "absolute inset-x-0 top-0 border-b border-white/15 bg-black/25 text-white backdrop-blur-sm"
        : "sticky top-0 border-b border-primary/20 bg-card/80 backdrop-blur-sm"
    )}>
      <nav className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-bold font-heading tracking-wider text-primary sm:text-2xl">
          WOWCAVE
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative text-xs font-semibold uppercase tracking-wider transition-all duration-300 group sm:text-sm",
                    isHome ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {loading ? (
              <span className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "pointer-events-none opacity-80"
              )}>
                Loading...
              </span>
            ) : status === "authenticated" && user ? (
              <Popover>
                <PopoverTrigger
                  openOnHover
                  delay={0}
                  closeDelay={120}
                  aria-label="Open profile menu"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 p-0 text-primary transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xs font-bold">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(event) => event.currentTarget.remove()}
                        className="absolute inset-0 size-full object-cover"
                      />
                    )}
                  </span>
                </PopoverTrigger>

                <PopoverContent>
                  <div className="mb-2 rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 text-left">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Profile</p>
                    <p className="mt-1 truncate text-sm font-semibold text-foreground">
                      {user.displayName || user.email || "Player"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                    >
                      View profile
                    </Link>

                    <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent">
                      <span>Theme</span>
                      <ThemeToggle />
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}