import os
import re

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will replace `lg:grid-cols-4` with `lg:grid-cols-5` and append the new button
grid_regex = r'<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">([\s\S]*?)</div>\n            </div>\n\n            {\/\* Box Management \*\/}'
match = re.search(grid_regex, content)
if match:
    buttons_html = match.group(1)
    
    new_button = '''
                <button onClick={() => handleGodAction("WIPE_PLAYER")} disabled={!godPlayerId} className="bg-red-900 hover:bg-red-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 border border-red-500/30">
                  <ShieldAlert className="w-6 h-6" /> Wipe Inventaire
                </button>
'''
    new_grid = '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">' + buttons_html + new_button + '</div>\n            </div>\n\n            {/* Box Management */}'
    
    content = content.replace(match.group(0), new_grid)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Wipe Inventaire button added")
else:
    print("Could not find God Mode buttons grid")
