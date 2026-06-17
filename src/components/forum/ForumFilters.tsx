"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function ForumFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const categories = [
    { id: "all", name: "Tous" },
    { id: "général", name: "Général" },
    { id: "guides", name: "Guides" },
    { id: "suggestions", name: "Suggestions" },
    { id: "hors-sujet", name: "Hors-sujet" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/forum?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/forum?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentCategory === cat.id
              ? "bg-[var(--color-accent-red)] text-white shadow-[0_0_15px_rgba(179,102,255,0.4)]"
              : "glass text-[var(--color-text-secondary)] hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} className="relative max-w-xs w-full">
        <input
          type="text"
          name="q"
          placeholder="Rechercher un sujet..."
          defaultValue={searchParams.get("q") || ""}
          className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-accent-red)] transition-colors"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-[var(--color-text-muted)]" />
      </form>
    </div>
  );
}