import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\cards\PackOpenerClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will systematically add comments to major sections.

new_code = content.replace(
    '  // UI States',
    '  // ==========================================\n  // ETATS DE L\'INTERFACE (UI STATES)\n  // =========================================='
)

new_code = new_code.replace(
    '  const openPack = async () => {',
    '  /**\n   * Fonction d\'ouverture de pack (booster).\n   * Gère l\'animation, l\'appel à l\'API et l\'ajout de la carte à l\'inventaire local.\n   */\n  const openPack = async () => {'
)

new_code = new_code.replace(
    '    // Check if user has this box',
    '    // Vérifier si l\'utilisateur possède au moins une box de ce type avant d\'appeler l\'API'
)

new_code = new_code.replace(
    '      // Consume a box locally to update UI fast',
    '      // Mettre à jour l\'inventaire des box localement pour un retour visuel immédiat (optimistic UI update)'
)

new_code = new_code.replace(
    '      setTimeout(() => {',
    '      // Attendre la fin de l\'animation (2.5s) avant d\'afficher la carte obtenue'
)

new_code = new_code.replace(
    '  // Group inventory by tradingCardId for Stacking',
    '  /**\n   * Regrouper les cartes en double (Stacking).\n   * Si l\'utilisateur a plusieurs fois la même carte, on n\'affiche qu\'une seule pile avec un compteur (x2, x3...)\n   */'
)

new_code = new_code.replace(
    '  // Convert to array and filter/sort',
    '  /**\n   * Appliquer les filtres (Recherche et Rareté) et trier les cartes par date d\'obtention (la plus récente en premier)\n   */'
)

new_code = new_code.replace(
    '  const ownedStandard =',
    '  // Récupération des quantités de box possédées pour l\'affichage'
)

new_code = new_code.replace(
    '      {/* TABS HEADER */}',
    '      {/* ==========================================\n          BARRE DE NAVIGATION DES ONGLETS\n          Permet de basculer entre l\'ouverture et la collection\n      ========================================== */}'
)

new_code = new_code.replace(
    '      {/* BOOSTER OPENING TAB */}',
    '      {/* ==========================================\n          ONGLET 1 : OUVERTURE DE BOX\n      ========================================== */}'
)

new_code = new_code.replace(
    '      {/* COLLECTION TAB */}',
    '      {/* ==========================================\n          ONGLET 2 : MA COLLECTION (INVENTAIRE)\n      ========================================== */}'
)

new_code = new_code.replace(
    '          {/* Filters Bar */}',
    '          {/* BARRE DE FILTRES ET RECHERCHE */}'
)

new_code = new_code.replace(
    '      {/* Fullscreen Card Modal with Info Pane */}',
    '      {/* ==========================================\n          MODAL DE DETAILS DE LA CARTE\n          S\'affiche lorsqu\'on clique sur une carte dans la collection\n      ========================================== */}'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_code)

print("Comments added!")
