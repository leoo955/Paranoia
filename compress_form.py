import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_form = False
form_step = 0

for i, line in enumerate(lines):
    if '<form onSubmit={handleCreateCard}' in line:
        in_form = True
        new_lines.append(line)
        # Add first folder
        new_lines.append('                <details open className="group bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-xl overflow-hidden">\n')
        new_lines.append('                  <summary className="cursor-pointer font-bold font-outfit text-white p-4 bg-black/20 hover:bg-black/40 transition-colors flex justify-between items-center select-none">\n')
        new_lines.append('                    Informations Générales\n')
        new_lines.append('                    <span className="text-xl group-open:rotate-180 transition-transform">▼</span>\n')
        new_lines.append('                  </summary>\n')
        new_lines.append('                  <div className="p-4 space-y-4">\n')
        continue

    if in_form:
        if '<div>' in line and '<label className="block text-sm text-[var(--color-text-secondary)] mb-1">Fond Custom (Image)</label>' in lines[i+1]:
            # Close first folder, open second
            new_lines.append('                  </div>\n')
            new_lines.append('                </details>\n\n')
            new_lines.append('                <details className="group bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-xl overflow-hidden">\n')
            new_lines.append('                  <summary className="cursor-pointer font-bold font-outfit text-white p-4 bg-black/20 hover:bg-black/40 transition-colors flex justify-between items-center select-none">\n')
            new_lines.append('                    Apparence & Design\n')
            new_lines.append('                    <span className="text-xl group-open:rotate-180 transition-transform">▼</span>\n')
            new_lines.append('                  </summary>\n')
            new_lines.append('                  <div className="p-4 space-y-4">\n')
            new_lines.append(line)
            continue
        
        if '<div>' in line and '<label className="block text-sm text-[var(--color-text-secondary)] mb-1">Probabilité d\'obtention (%)</label>' in lines[i+1]:
            # Move Probability and Description back to Informations Générales? 
            # Or leave them in Design? They were after Badge Custom. Wait, in original they were at the end of the first block before Full Art.
            pass

        if '<div className="pt-4 border-t border-[var(--color-border-color)]">' in line and '<h4 className="text-sm font-bold text-white mb-4">Mode Full Art & Visibilité</h4>' in lines[i+1]:
            # Close second folder, open third
            new_lines.append('                  </div>\n')
            new_lines.append('                </details>\n\n')
            new_lines.append('                <details className="group bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-xl overflow-hidden">\n')
            new_lines.append('                  <summary className="cursor-pointer font-bold font-outfit text-white p-4 bg-black/20 hover:bg-black/40 transition-colors flex justify-between items-center select-none">\n')
            new_lines.append('                    Options Avancées (Full Art, Badges)\n')
            new_lines.append('                    <span className="text-xl group-open:rotate-180 transition-transform">▼</span>\n')
            new_lines.append('                  </summary>\n')
            new_lines.append('                  <div className="p-4 space-y-4">\n')
            # Skip the <div className="pt-4..."> line to avoid double nesting if we want, but let's just keep it.
            # Actually, I will replace `<div className="pt-4 border-t border-[var(--color-border-color)]">` with just `<div>`
            new_lines.append('                <div>\n')
            continue

        if '<div className="pt-4 border-t border-[var(--color-border-color)]">' in line and '<div className="flex justify-between items-center mb-4">' in lines[i+1] and '<label className="block text-sm font-bold text-white">Badges Flottants</label>' in lines[i+2]:
            # This is the badges section. Keep it inside Advanced Options. Just remove the top border.
            new_lines.append('                <div>\n')
            continue

        if '{cardError && <p className="text-red-400 text-sm">{cardError}</p>}' in line:
            # Close the third folder before the submit button
            new_lines.append('                  </div>\n')
            new_lines.append('                </details>\n\n')
            new_lines.append(line)
            continue
        
        if '</form>' in line:
            in_form = False
            new_lines.append(line)
            continue

    new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Form compressed into accordions!")
