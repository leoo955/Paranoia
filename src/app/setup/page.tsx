"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, ShieldAlert, RefreshCw, Copy } from "lucide-react";

export default function SetupPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Default true if we haven't loaded session yet to prevent flash
  const isVerified = (session?.user as any)?.isMcVerified || false; 

  const generateCode = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/generate-mc-code", { method: "POST" });
      if (!res.ok) throw new Error("Erreur de génération");
      const data = await res.json();
      setCode(data.code);
    } catch (err) {
      setError("Impossible de générer le code.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(`/verify ${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkStatus = async () => {
    setIsLoading(true);
    await update(); // Force session refresh
    setIsLoading(false);
    // If verified, update() will change session.user.isMcVerified and UI will react
    // Wait, the next-auth session might not include isMcVerified by default.
    // Let's redirect to home if verified.
    if ((session?.user as any)?.isMcVerified || (session?.user as any)?.minecraftName) {
      window.location.href = "/";
    }
  };

  if (isVerified || (session?.user as any)?.minecraftName) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-slide-up">
        <div className="panel-matte p-8 md:p-12 rounded-2xl w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-outfit font-black text-white mb-2">Compte Vérifié</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Votre compte Minecraft est lié avec succès.
          </p>
          <a href="/" className="btn-primary py-3 px-8 inline-block">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-slide-up">
      <div className="panel-matte p-8 md:p-12 rounded-2xl w-full max-w-md text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[var(--color-accent-purple)]/20 blur-[60px] rounded-full pointer-events-none" />

        <div className="w-16 h-16 bg-[var(--color-bg-elevated)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-border-color)]">
          <ShieldAlert className="w-8 h-8 text-[var(--color-accent-purple)]" />
        </div>
        
        <h1 className="text-3xl font-outfit font-black text-white mb-2">Vérification IG</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Pour sécuriser votre compte et débloquer toutes les fonctionnalités, vous devez lier votre compte Minecraft en jeu.
        </p>

        {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

        {!code ? (
          <button 
            onClick={generateCode}
            disabled={isLoading}
            className="w-full btn-primary py-4 flex justify-center text-lg font-bold"
          >
            {isLoading ? "Génération..." : "Obtenir un code secret"}
          </button>
        ) : (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-accent-purple)]/50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-purple)]/10 to-transparent pointer-events-none" />
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">Connectez-vous sur le serveur et tapez :</p>
              
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/40 px-4 py-3 rounded-lg text-xl font-mono text-[var(--color-accent-purple)] font-bold border border-[var(--color-border-color)]">
                  /verify {code}
                </code>
                <button 
                  onClick={copyCode}
                  className="bg-black/40 p-3 rounded-lg border border-[var(--color-border-color)] hover:bg-[var(--color-border-color)] transition-colors"
                  title="Copier"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={checkStatus}
                disabled={isLoading}
                className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Vérification..." : "J'ai tapé la commande !"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
