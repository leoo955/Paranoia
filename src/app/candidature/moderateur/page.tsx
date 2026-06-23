"use client";

import { useState } from "react";
import { Check, Send, ShieldCheck, ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';

export default function ModCandidaturePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    discordName: "",
    minecraftName: "",
    platform: "Minecraft",
    experience: "",
    motivation: "",
    additions: "",
    other: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/candidature/moderateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      
      setIsSuccess(true);
      toast.success("Candidature envoyée avec succès !");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-slide-up text-center">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
          <Check className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Candidature Reçue</h1>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
          Merci pour ton intérêt ! Le staff étudiera ta candidature avec attention. Nous te recontacterons sur Discord si ton profil est retenu.
        </p>
        <button onClick={() => window.location.href = '/'} className="btn-primary">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-slide-up">
      <div className="text-center mb-12">
        <ShieldCheck className="w-16 h-16 text-indigo-500 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
        <h1 className="text-4xl font-outfit font-black text-white inline-block mb-4" style={{ textShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
          Recrutement <span className="text-indigo-400">Staff</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Vous souhaitez aider à modérer PARANOIA ? Remplissez ce formulaire avec le plus de détails possible.
        </p>
      </div>

      <div className="panel-matte p-8 md:p-12 rounded-2xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-bg-elevated)]">
          <div className="h-full bg-indigo-500 w-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Pseudo Discord *</label>
              <input
                type="text"
                required
                value={formData.discordName}
                onChange={e => setFormData({...formData, discordName: e.target.value})}
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Ex: utilisateur#1234"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Pseudo Minecraft *</label>
              <input
                type="text"
                required
                value={formData.minecraftName}
                onChange={e => setFormData({...formData, minecraftName: e.target.value})}
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Ex: Notch"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-3">Où voulez vous modérer ? *</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.platform === 'Minecraft' ? 'border-indigo-500' : 'border-gray-500 group-hover:border-gray-400'}`}>
                  {formData.platform === 'Minecraft' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                </div>
                <input
                  type="radio"
                  name="platform"
                  value="Minecraft"
                  checked={formData.platform === 'Minecraft'}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                  className="hidden"
                />
                <span className="text-white">Minecraft</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.platform === 'Discord' ? 'border-indigo-500' : 'border-gray-500 group-hover:border-gray-400'}`}>
                  {formData.platform === 'Discord' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                </div>
                <input
                  type="radio"
                  name="platform"
                  value="Discord"
                  checked={formData.platform === 'Discord'}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                  className="hidden"
                />
                <span className="text-white">Discord</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Avez vous déjà modérer dans un serveur (ou plusieurs) ? Si oui , lequel/lesquels ? *</label>
            <textarea
              required minLength={10}
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
              className="w-full h-24 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Votre réponse..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Pour quelles raisons voulez vous faire parti de la modération? *</label>
            <textarea
              required minLength={20}
              value={formData.motivation}
              onChange={e => setFormData({...formData, motivation: e.target.value})}
              className="w-full h-32 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Votre réponse..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Qu'est ce que vous pourrez ajouter au serveur? *</label>
            <textarea
              required minLength={20}
              value={formData.additions}
              onChange={e => setFormData({...formData, additions: e.target.value})}
              className="w-full h-32 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Votre réponse..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Quelque chose d'autre a ajouter ? *</label>
            <textarea
              value={formData.other}
              onChange={e => setFormData({...formData, other: e.target.value})}
              className="w-full h-24 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Votre réponse (facultatif)..."
            />
          </div>

          <div className="pt-6 border-t border-[var(--color-border-color)] flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider rounded-xl transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Envoyer la candidature
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
