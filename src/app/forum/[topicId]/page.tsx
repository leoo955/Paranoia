import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = await params;
  const topic = await prisma.topic.findUnique({ where: { id: resolvedParams.topicId } });
  if (!topic) return { title: "Introuvable | PARANOIA" };
  return { title: `${topic.title} | PARANOIA Forum` };
}

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = await params;
  const topic = await prisma.topic.findUnique({
    where: { id: resolvedParams.topicId },
    include: {
      author: { select: { name: true, image: true, role: true } },
      comments: {
        include: {
          author: { select: { name: true, image: true, role: true } },
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!topic) notFound();

  await prisma.topic.update({
    where: { id: topic.id },
    data: { views: { increment: 1 } }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <Link href="/forum" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au forum</span>
      </Link>
      <div className="panel-matte p-8 rounded-2xl mb-8 border-l-4 border-l-[var(--color-accent-purple)]">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {topic.category}
          </span>
          <span className="text-[var(--color-text-muted)] text-sm">{formatRelativeTime(topic.createdAt)}</span>
        </div>
        <h1 className="text-3xl font-outfit font-black text-white mb-6">{topic.title}</h1>
        <div className="prose prose-invert max-w-none text-[var(--color-text-primary)]">
          {topic.content.split('\n').map((line, i) => (
            <p key={i} className="mb-4">{line}</p>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--color-border-color)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent-purple)] flex items-center justify-center font-bold text-white">
            {topic.author.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              {topic.author.name || "Anonyme"}
              {topic.author.role === "ADMIN" && <span className="text-[10px] bg-red-600 px-1.5 rounded text-white">STAFF</span>}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Auteur du sujet</div>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-outfit font-bold text-white mb-6">{topic.comments.length} Réponses</h3>
      <div className="space-y-4">
        {topic.comments.map(comment => (
          <div key={comment.id} className="panel-matte p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center font-bold text-white text-sm">
                  {comment.author.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <span className="font-bold text-white">{comment.author.name || "Anonyme"}</span>
              </div>
              <span className="text-[var(--color-text-muted)] text-sm">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <p className="text-[var(--color-text-primary)] whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        <div className="panel-matte p-6 rounded-xl mt-8">
           <h4 className="font-outfit font-bold text-white mb-4">Répondre (Connectez-vous via Discord)</h4>
        </div>
      </div>
    </div>
  );
}