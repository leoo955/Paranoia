"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, MessageSquare, Trophy, FileText, Sparkles, Home, LogIn, LogOut, ShieldAlert, ShoppingCart, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Forum", href: "/forum", icon: MessageSquare },
  { name: "Tier List", href: "/tier-list", icon: Trophy },
  { name: "Trading Cards", href: "/cards", icon: Sparkles },
  { name: "Candidature", href: "/candidature", icon: FileText },
  { name: "Boutique", href: "/shop", icon: ShoppingCart },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

if (pathname === '/coming-soon') return null;


  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-[rgba(10,10,15,0.85)] backdrop-blur-md border-[var(--color-border-color)] shadow-lg"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <Image
              src="/Paranoia_no_effect.png" unoptimized
              alt="PARANOIA SMP"
              width={160}
              height={50}
              className="object-contain drop-shadow-[0_0_10px_rgba(179,102,255,0.5)] transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "text-white bg-[rgba(255,255,255,0.05)] border-b-2 border-[var(--color-accent-purple)]"
                      : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-[var(--color-accent-purple)]" : "group-hover:text-[var(--color-accent-purple)] transition-colors")} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-24 h-10 bg-[var(--color-bg-elevated)] animate-pulse rounded-lg"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" className="flex items-center gap-2 text-[var(--color-accent-purple)] hover:text-white transition-colors text-sm font-bold">
                    <ShieldAlert className="w-4 h-4" /> Admin
                  </Link>
                )}
                {(session.user as any)?.paraCoins !== undefined && (
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg">
                    <img src="/Paracoin.png" alt="PARA" className="w-4 h-4 object-contain" />
                    <span className="text-sm font-black text-yellow-400">{(session.user as any)?.paraCoins ?? 0}</span>
                  </div>
                )}
                <Link href="/cards" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <img src={session.user?.image || ""} alt="Avatar" className="w-8 h-8 rounded-full border border-[var(--color-border-color)]" />
                  <span className="text-sm font-medium text-white">{(session.user as any)?.minecraftName || session.user?.name}</span>
                </Link>
                <button onClick={() => signOut()} className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors p-2" title="Déconnexion">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => signIn("discord")} className="btn-primary flex items-center space-x-2 text-sm">
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[var(--color-text-secondary)] hover:text-white focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden panel-matte border-t-0 animate-slide-up origin-top absolute top-20 left-0 right-0 p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  isActive
                    ? "bg-[rgba(179,102,255,0.1)] text-white border-l-4 border-[var(--color-accent-purple)]"
                    : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[var(--color-accent-purple)]" : "")} />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[var(--color-border-color)]">
            {status === "loading" ? (
              <div className="w-full h-12 bg-[var(--color-bg-elevated)] animate-pulse rounded-lg"></div>
            ) : session ? (
              <div className="space-y-3">
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center space-x-2 py-3 bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-accent-purple)] font-bold">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Panel Admin</span>
                  </Link>
                )}
                <div className="flex items-center justify-between bg-[var(--color-bg-elevated)] p-3 rounded-lg border border-[var(--color-border-color)]">
                  <div className="flex items-center space-x-3">
                    <img src={session.user?.image || ""} alt="Avatar" className="w-10 h-10 rounded-full" />
                    <span className="font-medium text-white">{(session.user as any)?.minecraftName || session.user?.name}</span>
                  </div>
                  <button onClick={() => signOut()} className="text-red-400 hover:text-red-300 p-2">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => signIn("discord")} className="w-full btn-primary flex justify-center items-center space-x-2 py-3">
                <LogIn className="w-5 h-5" />
                <span>Connexion Discord</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}