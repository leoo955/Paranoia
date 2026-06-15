import subprocess
import re

result = subprocess.run(["git", "show", "d36c5e2:src/app/admin/page.tsx"], capture_output=True, text=True, encoding="utf-8")
old_content = result.stdout

cards_regex = r'\{activeTab === "cards" && \(([\s\S]*?)\n        \)\}'
match = re.search(cards_regex, old_content)

if match:
    cards_block = '{activeTab === "cards" && (' + match.group(1) + '\n        )}'
    
    file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        current_content = f.read()
        
    moderation_target = '{activeTab === "moderation" && ('
    new_content = current_content.replace(moderation_target, cards_block + '\n\n        ' + moderation_target)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Cards block restored successfully")
else:
    print("Could not find cards block in git commit")
