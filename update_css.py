import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\globals.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "@keyframes shake" not in content:
    keyframes = '''
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  50% { transform: translateX(5px) rotate(5deg); }
  75% { transform: translateX(-5px) rotate(-5deg); }
}

@keyframes flash {
  0% { opacity: 0; }
  10% { opacity: 1; }
  100% { opacity: 0; }
}
'''
    content += keyframes
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added animations to globals.css")
else:
    print("Animations already exist")
