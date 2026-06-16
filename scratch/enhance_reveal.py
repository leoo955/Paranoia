import re

with open("src/app/cards/PackOpenerClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import for confetti
import_statement = "import confetti from 'canvas-confetti';\n"
if "canvas-confetti" not in content:
    content = content.replace("import toast from 'react-hot-toast';", "import toast from 'react-hot-toast';\n" + import_statement)

# 2. Add useEffect for triggering confetti when showReveal becomes true and it's a big drop
use_effect_confetti = """
  // Trigger Confetti on Reveal
  useEffect(() => {
    if (showReveal && (openingGlow === 'MYTHIC' || openingGlow === 'LEGENDARY')) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: openingGlow === 'MYTHIC' ? ['#ef4444', '#dc2626', '#b91c1c', '#ffffff'] : ['#facc15', '#eab308', '#ca8a04', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: openingGlow === 'MYTHIC' ? ['#ef4444', '#dc2626', '#b91c1c', '#ffffff'] : ['#facc15', '#eab308', '#ca8a04', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [showReveal, openingGlow]);
"""

# Inject before buyBooster
if "Trigger Confetti on Reveal" not in content:
    content = content.replace("  const buyBooster =", use_effect_confetti + "\n  const buyBooster =")


# 3. Add HUGE Text overlay for MYTHIC/LEGENDARY
huge_text_overlay = """
              {/* HUGE TEXT OVERLAY FOR BIG WINS */}
              {showReveal && (openingGlow === 'MYTHIC' || openingGlow === 'LEGENDARY') && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center pointer-events-none">
                  <h2 className={`font-black uppercase tracking-widest animate-huge-reveal ${
                    openingGlow === 'MYTHIC' ? 'text-red-500 drop-shadow-[0_0_80px_rgba(239,68,68,1)] text-stroke-mythic' : 
                    'text-yellow-400 drop-shadow-[0_0_80px_rgba(250,204,21,1)] text-stroke-legendary'
                  }`} style={{ WebkitTextStroke: '3px white', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8))' }}>
                    {openingGlow === 'MYTHIC' ? 'MYTHIQUE !' : 'LÉGENDAIRE !'}
                  </h2>
                </div>
              )}
"""

if "HUGE TEXT OVERLAY FOR BIG WINS" not in content:
    # Inject it right after openingGlow's flash overlay
    content = content.replace("              {openingGlow && (", huge_text_overlay + "\n              {openingGlow && (")

with open("src/app/cards/PackOpenerClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated PackOpenerClient.tsx")
