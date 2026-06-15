import os
import re

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\cards\PackOpenerClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will revert the specific comment additions
content = content.replace(
    '  // ==========================================\n  // ETATS DE L\'INTERFACE (UI STATES)\n  // ==========================================',
    ''
)

content = content.replace(
    '  /**\n   * Fonction d\'ouverture de pack (booster).\n   * Gère l\'animation, l\'appel à l\'API et l\'ajout de la carte à l\'inventaire local.\n   */\n  const openPack = async () => {',
    '  const openPack = async () => {'
)

content = content.replace(
    '    // Vérifier si l\'utilisateur possède au moins une box de ce type avant d\'appeler l\'API',
    ''
)

content = content.replace(
    '      // Mettre à jour l\'inventaire des box localement pour un retour visuel immédiat (optimistic UI update)',
    ''
)

content = content.replace(
    '      // Attendre la fin de l\'animation (2.5s) avant d\'afficher la carte obtenue',
    ''
)

content = content.replace(
    '  /**\n   * Regrouper les cartes en double (Stacking).\n   * Si l\'utilisateur a plusieurs fois la même carte, on n\'affiche qu\'une seule pile avec un compteur (x2, x3...)\n   */',
    ''
)

content = content.replace(
    '  /**\n   * Appliquer les filtres (Recherche et Rareté) et trier les cartes par date d\'obtention (la plus récente en premier)\n   */',
    ''
)

content = content.replace(
    '  // Récupération des quantités de box possédées pour l\'affichage',
    ''
)

content = content.replace(
    '      {/* ==========================================\n          BARRE DE NAVIGATION DES ONGLETS\n          Permet de basculer entre l\'ouverture et la collection\n      ========================================== */}',
    ''
)

content = content.replace(
    '      {/* ==========================================\n          ONGLET 1 : OUVERTURE DE BOX\n      ========================================== */}',
    ''
)

content = content.replace(
    '      {/* ==========================================\n          ONGLET 2 : MA COLLECTION (INVENTAIRE)\n      ========================================== */}',
    ''
)

content = content.replace(
    '          {/* BARRE DE FILTRES ET RECHERCHE */}',
    ''
)

content = content.replace(
    '      {/* ==========================================\n          MODAL DE DETAILS DE LA CARTE\n          S\'affiche lorsqu\'on clique sur une carte dans la collection\n      ========================================== */}',
    ''
)

# Also remove empty lines that were left behind by replace
content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Comments removed!")
