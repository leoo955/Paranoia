"use client";

import { useState, useEffect } from "react";
import { Users, Sparkles, Layers, ShieldAlert, ImagePlus, ChevronRight, Activity, Database, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    players: 0,
    cards: 0,
    variants: 0,
    editions: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resP, resC, resV, resE, resU] = await Promise.all([
          fetch("/api/players"),
          fetch("/api/cards"),
          fetch("/api/variants"),
          fetch("/api/editions"),
          fetch("/api/admin/users")
        ]);
        setStats({
          players: (await resP.json()).length,
          cards: (await resC.json()).length,
          variants: (await resV.json()).length,
          editions: (await resE.json()).length,
          users: (await resU.json()).length
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  const statCards = [
    { name: "Joueurs", value: stats.players, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", href: "/admin/players" },
    { name: "Cartes", value: stats.cards, icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", href: "/admin/cards" },
    { name: "Variantes", value: stats.variants, icon: Layers, color: "text-indigo-400", bg: "bg-indigo-500/10", href: "/admin/variants" },
    { name: "Éditions", value: stats.editions, icon: ImagePlus, color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/admin/shop" },
    { name: "Utilisateurs", value: stats.users, icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", href: "/admin/moderation" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 border-b border-white/5 pb-8">
        <div className="p-3 bg-fuchsia-500/20 rounded-2xl text-fuchsia-400">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white tracking-tight uppercase">Tableau de Bord</h2>
          <p className="text-[var(--color-text-secondary)]">Aperçu global de l'activité du serveur.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((stat) => (
              <Link 
                key={stat.name} 
                href={stat.href}
                className="group p-6 rounded-[2rem] bg-[#111118] border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                  <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-outfit">
                          {loading ? "..." : stat.value}
                      </span>
                      <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
              </Link>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Access Links */}
          <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Database className="w-5 h-5 text-indigo-400" /> Actions Rapides
              </h3>
              <div className="space-y-3">
                  {[
                      { name: "Créer une nouvelle carte", href: "/admin/cards", desc: "Ajoutez un nouveau talent à la collection." },
                      { name: "Lancer une promotion", href: "/admin/shop", desc: "Mettez en avant une édition dans la boutique." },
                      { name: "Gérer les permissions", href: "/admin/moderation", desc: "Modifiez les rôles des membres." },
                  ].map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                      >
                          <div>
                              <p className="font-bold text-white group-hover:text-fuchsia-400 transition-colors">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                      </Link>
                  ))}
              </div>
          </div>

          {/* System Info */}
          <div className="bg-indigo-950/10 border border-indigo-500/20 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 mb-2">
                  <Activity className="w-10 h-10 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Système Opérationnel</h3>
              <p className="text-[var(--color-text-secondary)] text-sm max-w-xs mx-auto">
                  Toutes les API sont fonctionnelles. La base de données Render est synchronisée avec le client local.
              </p>
              <div className="pt-4 flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              </div>
          </div>
      </div>
    </div>
  );
}
