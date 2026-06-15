import os
import re

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the God Mode button from the tab navigation
button_regex = r'<button\s*onClick=\{.*?setActiveTab\("godmode"\).*?God Mode\s*</button>'
content = re.sub(button_regex, '', content, flags=re.DOTALL)

# Extract the God Mode content
god_mode_regex = r'\{activeTab === "godmode" && \(([\s\S]*?)\n        \)\}'
match = re.search(god_mode_regex, content)
if match:
    god_mode_content = match.group(1)
    # Remove the activeTab === "godmode" block completely
    content = content.replace('{activeTab === "godmode" && (' + god_mode_content + '\n        )}', '')
    
    # Now inject the God Mode content at the TOP of the Moderation tab
    # The Moderation tab starts with:
    # {activeTab === "moderation" && (
    #   <div className="space-y-8 animate-fade-in">
    moderation_start = '{activeTab === "moderation" && (\n          <div className="space-y-8 animate-fade-in">'
    
    # Inside god_mode_content, the root is also `<div className="space-y-8 animate-fade-in">`
    # Let's extract the inside of the god mode div:
    inner_god_mode_match = re.search(r'<div className="space-y-8 animate-fade-in">([\s\S]*?)</div>\s*$', god_mode_content)
    if inner_god_mode_match:
        inner_god_mode = inner_god_mode_match.group(1)
        # Inject inner_god_mode just after moderation_start
        new_moderation_start = moderation_start + inner_god_mode + '\n            {/* Separator */}\n            <div className="h-px bg-[var(--color-border-color)] my-8"></div>\n'
        content = content.replace(moderation_start, new_moderation_start)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("God Mode moved to Moderation")
