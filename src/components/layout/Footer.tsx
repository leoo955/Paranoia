import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-color)] bg-[var(--color-bg-secondary)] mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <span className="font-outfit font-black text-2xl tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">
              PARANOIA
            </span>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Serveur Minecraft SMP Privé. L'élite de la survie.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors">Accueil</Link>
            <Link href="/forum" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors">Forum</Link>
            <Link href="/tier-list" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors">Tier List</Link>
            <Link href="/cards" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors">Trading Cards</Link>
            <Link href="/candidature" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors">Nous rejoindre</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[var(--color-border-color)] text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} PARANOIA SMP. Tous droits réservés.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 md:mt-0">
            Non affilié à Mojang AB.
          </p>
        </div>
      </div>
    </footer>
  );
}
