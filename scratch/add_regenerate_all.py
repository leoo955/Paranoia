import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the handleGenerateMissingImages function
old_func = """  const handleGenerateMissingImages = () => {
    const missing = cards.filter(c => !c.renderedImageUrl || c.renderedImageUrl.startsWith('/uploads'));
    if (missing.length === 0) {
      toast("Toutes les cartes ont déjà leur image Discord !", { icon: '⚠️' });
      return;
    }

    confirmToast(`Voulez-vous générer l'image Discord pour ${missing.length} cartes ? Cela peut prendre du temps.`, async () => {
      setIsBatchGenerating(true);
      setBatchTotal(missing.length);
      setBatchProgress(0);

      for (let i = 0; i < missing.length; i++) {
        const card = missing[i];"""

new_func = """  const handleGenerateImages = (regenerateAll = false) => {
    const targetCards = regenerateAll ? cards : cards.filter(c => !c.renderedImageUrl || c.renderedImageUrl.startsWith('/uploads'));
    if (targetCards.length === 0) {
      toast("Toutes les cartes ont déjà leur image Discord !", { icon: '⚠️' });
      return;
    }

    confirmToast(`Voulez-vous ${regenerateAll ? 'regénérer' : 'générer'} l'image Discord pour ${targetCards.length} cartes ? Cela peut prendre du temps.`, async () => {
      setIsBatchGenerating(true);
      setBatchTotal(targetCards.length);
      setBatchProgress(0);

      for (let i = 0; i < targetCards.length; i++) {
        const card = targetCards[i];"""

content = content.replace(old_func, new_func)

# Replace the button block
old_button_block = """                <button 
                  onClick={handleGenerateMissingImages}
                  disabled={isBatchGenerating}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
                >
                  {isBatchGenerating ? (
                    <>
                      <span className="animate-spin text-lg">↻</span>
                      Génération... ({batchProgress}/{batchTotal})
                    </>
                  ) : (
                    <>
                      <ImagePlus size={16} />
                      Générer les images Discord manquantes
                    </>
                  )}
                </button>"""

new_button_block = """                <div className="flex gap-2">
                  <button 
                    onClick={() => handleGenerateImages(false)}
                    disabled={isBatchGenerating}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
                  >
                    {isBatchGenerating ? (
                      <>
                        <span className="animate-spin text-lg">↻</span>
                        Génération... ({batchProgress}/{batchTotal})
                      </>
                    ) : (
                      <>
                        <ImagePlus size={16} />
                        Générer manquantes
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleGenerateImages(true)}
                    disabled={isBatchGenerating}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
                  >
                    {isBatchGenerating ? (
                      <>
                        <span className="animate-spin text-lg">↻</span>
                        Génération...
                      </>
                    ) : (
                      <>
                        <ImagePlus size={16} />
                        Tout Regénérer
                      </>
                    )}
                  </button>
                </div>"""

content = content.replace(old_button_block, new_button_block)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added Regenerate All option!")
