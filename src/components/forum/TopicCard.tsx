import Link from "next/link";
import { MessageSquare, Eye, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    category: string;
    views: number;
    createdAt: Date;
    author: {
      name: string | null;
    };
    _count: {
      comments: number;
    };
  };
}

export default function TopicCard({ topic }: TopicCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "général": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "guides": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "suggestions": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border-color)]";
    }
  };

  return (
    <Link href={`/forum/${topic.id}`} className="block">
      <div className="panel-matte p-5 rounded-xl card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(topic.category)}`}>
              {topic.category}
            </span>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] truncate font-outfit group-hover:text-[var(--color-accent-red)] transition-colors">
              {topic.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <div className="w-6 h-6 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-bold text-white">
              {topic.author.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <span>par <span className="text-[var(--color-text-secondary)]">{topic.author.name || "Anonyme"}</span></span>
          </div>
        </div>
        
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] md:justify-end">
          <div className="flex items-center gap-1.5" title="Vues">
            <Eye className="w-4 h-4" />
            <span>{topic.views}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Réponses">
            <MessageSquare className="w-4 h-4" />
            <span>{topic._count.comments}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Créé il y a">
            <Clock className="w-4 h-4" />
            <span>{formatRelativeTime(topic.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
