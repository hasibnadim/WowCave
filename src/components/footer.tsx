import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card/50 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">WOWCAVE</span>
          <span className="text-border">•</span>
          <Link href="/about" className="hover:text-primary">About</Link> 
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}