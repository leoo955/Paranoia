import re
import os
import sys

def remove_comments(content, file_ext):
    if file_ext in ['.ts', '.tsx', '.js', '.mjs', '.json']:
        # Regex to match strings, regex literals, and comments
        # Group 1: Strings (double quotes)
        # Group 2: Strings (single quotes)
        # Group 3: Template literals
        # Group 4: Regex literals
        # Group 5: Multi-line comments
        # Group 6: Single-line comments
        pattern = r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|(?s:`(?:\\.|[^`\\])*`)|/(?:\\.|[^/\\\n])+/)|(/\*(?:.|\n)*?\*/)|(//.*)'
        
        def replace(match):
            if match.group(1): # It's a string or regex, return as is
                return match.group(1)
            elif match.group(2): # Multi-line comment
                # print(f"Removing multi-line comment: {match.group(2)[:50]}...")
                return ""
            elif match.group(3): # Single-line comment
                # print(f"Removing single-line comment: {match.group(3)[:50]}...")
                return ""
            return ""
        
        return re.sub(pattern, replace, content)
    
    elif file_ext == '.css':
        # CSS only officially supports /* */ but many tools support //
        pattern = r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')|(/\*(?:.|\n)*?\*/)|(//.*)'
        def replace(match):
            if match.group(1):
                return match.group(1)
            else:
                return ""
        return re.sub(pattern, replace, content)
    
    return content

files = [
    r"src/app/admin/page.tsx",
    r"src/app/api/admin/cards/manage/route.ts",
    r"src/app/api/admin/cards/variants/links/route.ts",
    r"src/app/api/admin/users/economy/route.ts",
    r"src/app/api/admin/users/route.ts",
    r"src/app/api/auth/[...nextauth]/route.ts",
    r"src/app/api/boosters/add-coins/route.ts",
    r"src/app/api/boosters/buy/route.ts",
    r"src/app/api/bot/give-box/route.ts",
    r"src/app/api/cards/route.ts",
    r"src/app/api/editions/route.ts",
    r"src/app/api/mc-check/route.ts",
    r"src/app/api/mc-verify/route.ts",
    r"src/app/api/og/card/route.tsx",
    r"src/app/api/packs/route.ts",
    r"src/app/api/players/route.ts",
    r"src/app/api/shop/buy/route.ts",
    r"src/app/api/templates/route.ts",
    r"src/app/api/tierlist/route.ts",
    r"src/app/api/upload/route.ts",
    r"src/app/api/user/generate-mc-code/route.ts",
    r"src/app/api/user/setup/route.ts",
    r"src/app/api/variants/route.ts",
    r"src/app/candidature/page.tsx",
    r"src/app/cards/PackOpenerClient.tsx",
    r"src/app/cards/page.tsx",
    r"src/app/forum/[topicId]/page.tsx",
    r"src/app/forum/page.tsx",
    r"src/app/setup/page.tsx",
    r"src/app/shop/page.tsx",
    r"src/app/shop/ShopClient.tsx",
    r"src/app/tier-list/page.tsx",
    r"src/app/globals.css",
    r"src/app/layout.tsx",
    r"src/app/page.tsx",
    r"src/components/cards/CardDisplay.tsx",
    r"src/components/forum/ForumFilters.tsx",
    r"src/components/forum/TopicCard.tsx",
    r"src/components/home/HomePageClient.tsx",
    r"src/components/layout/Footer.tsx",
    r"src/components/layout/Navbar.tsx",
    r"src/components/providers.tsx",
    r"src/lib/auth.ts",
    r"src/lib/db.ts",
    r"src/lib/utils.ts",
    r"src/lib/validators.ts",
    r"src/types/index.ts",
    r"src/proxy.ts",
    r"bot/index.ts",
    r"makeAdmin.js",
    r"next.config.ts",
    r"postcss.config.mjs",
    r"eslint.config.mjs",
    r"tsconfig.json"
]

for file_path in files:
    if os.path.exists(file_path):
        print(f"Processing {file_path}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        ext = os.path.splitext(file_path)[1]
        new_content = remove_comments(content, ext)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
        else:
            print(f"No comments found in {file_path}")
    else:
        print(f"File not found: {file_path}")
