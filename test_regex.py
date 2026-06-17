import re

content = """
                      // Auto-assign probabilities based on rarity
                      if (newRarity === 'COMMON') setCardProba(45);
"""

pattern = r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|(?s:`(?:\\.|[^`\\])*`)|/(?:\\.|[^/\\\n])+/)|(/\*(?:.|\n)*?\*/)|(//.*)'

def replace(match):
    if match.group(1):
        print(f"Matched Group 1: {match.group(1)}")
        return match.group(1)
    elif match.group(2):
        print(f"Matched Group 2: {match.group(2)}")
        return ""
    elif match.group(3):
        print(f"Matched Group 3: {match.group(3)}")
        return ""
    return ""

new_content = re.sub(pattern, replace, content)
print(f"Result: {new_content}")
