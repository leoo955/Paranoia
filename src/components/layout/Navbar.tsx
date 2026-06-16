"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, MessageSquare, Trophy, FileText, Sparkles, Home, LogIn, LogOut, ShieldAlert, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Dock from "@/components/ui/Dock";

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

  // Force Next.js to refresh data from server when navigating to avoid stale cache
  useEffect(() => {
    router.refresh();
  }, [pathname, router]);

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
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <Image 
              src="/Paranoia_no_effect.png" 
              alt="PARANOIA SMP" 
              width={160} 
              height={50} 
              className="object-contain drop-shadow-[0_0_10px_rgba(179,102,255,0.5)] transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
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
                      ? "text-white bg-[rgba(255,255,255,0.05)] border-b-2 border-[var(--color-accent-red)]"
                      : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-[var(--color-accent-red)]" : "group-hover:text-[var(--color-accent-red)] transition-colors")} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Login Button (Desktop & Mobile) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {status === "loading" ? (
              <div className="w-10 md:w-24 h-10 bg-[var(--color-bg-elevated)] animate-pulse rounded-lg"></div>
            ) : session ? (
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* @ts-ignore */}
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" className="hidden md:flex items-center gap-2 text-[var(--color-accent-purple)] hover:text-white transition-colors text-sm font-bold">
                    <ShieldAlert className="w-4 h-4" /> Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <img src={session.user?.image || ""} alt="Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[var(--color-border-color)]" />
                  <span className="hidden md:inline text-sm font-medium text-white">{(session.user as any)?.minecraftName || session.user?.name}</span>
                </div>
                <button onClick={() => signOut()} className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors p-2" title="Déconnexion">
                  <LogOut className="w-5 h-5 md:w-4 md:h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => signIn("discord")} className="btn-primary flex items-center space-x-2 text-sm px-3 py-1.5 md:px-4 md:py-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dock Navigation */}
      <div className="md:hidden">
        <Dock 
          items={navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return {
              icon: <Icon size={20} className={isActive ? "text-[var(--color-accent-red)]" : "text-gray-300"} />,
              label: link.name,
              onClick: () => router.push(link.href),
              className: isActive ? "active" : ""
            };
          })}
          panelHeight={60}
          baseItemSize={45}
          magnification={60}
          distance={100}
        />
      </div>
    </nav>
  );
}
