import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\cards\PackOpenerClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("Autel d'Invocation", "Ouvrir des Box")
content = content.replace("Sélectionnez une relique et invoquez la puissance des joueurs. Quelle sera votre prochaine carte ?", "Sélectionnez une box et ouvrez-la pour obtenir de nouvelles cartes !")
content = content.replace(">INVOQUER<", ">OUVRIR<")
content = content.replace("INVOQUER", "OUVRIR")
content = content.replace("Allez dans l'Autel d'Invocation pour ouvrir des boosters !", "Allez dans l'onglet \"Ouvrir des Box\" pour en ouvrir !")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Naming fixed!")
