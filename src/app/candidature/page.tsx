"use client";

import { useState } from "react";
import { Check, Send, ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';

export default function CandidaturePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    minecraftName: "",
    age: "",
    motivation: "",
    experience: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success("Candidature envoyée avec succès ! (Simulation)");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-slide-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-outfit font-black text-white glow-red inline-block mb-4 text-gradient">
          Rejoindre le Serveur
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Soumettez votre candidature pour accéder au SMP.
        </p>
      </div>

      <div className="panel-matte p-8 md:p-12 rounded-2xl relative overflow-hidden">
        {}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-bg-elevated)]">
          <div
            className="h-full bg-[var(--color-accent-red)] transition-all duration-500 ease-in-out glow-red"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-2xl font-outfit font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[rgba(179,102,255,0.2)] text-[var(--color-accent-red)] flex items-center justify-center text-sm">1</span>
                Informations Joueur
              </h2>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Pseudo Minecraft</label>
                <input
                  type="text"
                  required
                  value={formData.minecraftName}
                  onChange={e => setFormData({...formData, minecraftName: e.target.value})}
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-red)] transition-colors"
                  placeholder="Notch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Âge</label>
                <input
                  type="number"
                  required min="13" max="99"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-red)] transition-colors"
                  placeholder="18"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="button" onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-2xl font-outfit font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[rgba(179,102,255,0.2)] text-[var(--color-accent-red)] flex items-center justify-center text-sm">2</span>
                Profil de Survie
              </h2>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Vos motivations (Pourquoi nous ?)</label>
                <textarea
                  required minLength={50}
                  value={formData.motivation}
                  onChange={e => setFormData({...formData, motivation: e.target.value})}
                  className="w-full h-32 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-red)] transition-colors resize-none"
                  placeholder="Expliquez ce que vous recherchez sur ce serveur..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Vos spécialités / Expérience</label>
                <textarea
                  required minLength={20}
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full h-32 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-red)] transition-colors resize-none"
                  placeholder="Redstone, Build, PvP, Farming intensif..."
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  Retour
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary flex items-center gap-2">
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-2xl font-outfit font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[rgba(179,102,255,0.2)] text-[var(--color-accent-red)] flex items-center justify-center text-sm">3</span>
                Confirmation
              </h2>
              <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg p-6 space-y-4">
                <div>
                  <div className="text-sm text-[var(--color-text-muted)]">Pseudo</div>
                  <div className="font-bold text-white">{formData.minecraftName} ({formData.age} ans)</div>
                </div>
                <div className="pt-4 border-t border-[var(--color-border-color)]">
                  <div className="text-sm text-[var(--color-text-muted)] mb-1">Motivations</div>
                  <div className="text-[var(--color-text-secondary)] text-sm line-clamp-2">{formData.motivation}</div>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)] rounded-lg cursor-pointer group">
                <input type="checkbox" required className="mt-1 accent-[var(--color-accent-red)]" />
                <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-white transition-colors">
                  Je jure solennellement que ces informations sont exactes. J'ai lu et j'accepte les règles du serveur PARANOIA. Je suis conscient(e) qu'une trahison sera lourdement punie.
                </span>
              </label>

              <div className="pt-4 flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                  Retour
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Send className="w-4 h-4" /> Soumettre
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}