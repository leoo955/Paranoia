import subprocess
import re

# Get the previous version of the file from git
result = subprocess.run(["git", "show", "HEAD:src/app/admin/page.tsx"], capture_output=True, text=True, encoding="utf-8")
old_content = result.stdout

# Extract the cards block
cards_regex = r'\{activeTab === "cards" && \([\s\S]*?\)\}\n\n        \{activeTab === "categories"'
match = re.search(cards_regex, old_content)

if match:
    cards_block = match.group(0).replace('\n\n        {activeTab === "categories"', '')
    
    # Now read the current file
    file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        current_content = f.read()
        
    # Inject it before the moderation block
    moderation_target = '{activeTab === "moderation" && ('
    new_content = current_content.replace(moderation_target, cards_block + '\n\n        ' + moderation_target)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Cards block restored")
else:
    print("Could not find cards block in git history")
