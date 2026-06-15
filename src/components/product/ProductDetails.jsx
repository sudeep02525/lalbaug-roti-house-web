import { Flame, Droplets } from 'lucide-react'

export default function ProductDetails({ product, nutritionFacts, activeTab, setActiveTab }) {
  return (
    <>
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-[#EAE5D9] mb-8 pb-4">
        <button 
          onClick={() => setActiveTab('description')}
          className={`text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'description' ? 'text-[#114D3C]' : 'text-[#A09D96] hover:text-[#73706A]'}`}
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Description
          {activeTab === 'description' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#16A34A]" />}
        </button>
        <button 
          onClick={() => setActiveTab('ingredients')}
          className={`text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'ingredients' ? 'text-[#114D3C]' : 'text-[#A09D96] hover:text-[#73706A]'}`}
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Details
          {activeTab === 'ingredients' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#16A34A]" />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-10 min-h-[120px]">
        {activeTab === 'description' && (
          <div className="animate-fade-in">
            <p className="text-[#4A5568] text-lg leading-relaxed" style={{ fontFamily: "var(--font-outfit)" }}>
              {product.description || "A delicious and wholesome meal prepared with fresh ingredients and authentic spices. Perfect for your daily cravings."}
            </p>
            
            {/* Nutritional Info Badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-3 rounded-2xl border border-[#EAE5D9]">
                <div className="w-8 h-8 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#73706A]">Calories</p>
                  <p className="text-sm font-bold text-[#114D3C]">{nutritionFacts.cal} kcal</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-3 rounded-2xl border border-[#EAE5D9]">
                <div className="w-8 h-8 rounded-full bg-[#C19B6C]/10 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-[#C19B6C]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#73706A]">Protein</p>
                  <p className="text-sm font-bold text-[#114D3C]">{nutritionFacts.protein}g</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'ingredients' && (
          <div className="animate-fade-in text-[#4A5568]" style={{ fontFamily: "var(--font-outfit)" }}>
            <h4 className="font-bold text-[#114D3C] mb-3">Chef's Note</h4>
            <p className="text-md leading-relaxed mb-6">
              Our {product.name.toLowerCase()} is prepared daily in small batches to ensure maximum freshness. We source our grains, vegetables, and spices directly from premium local markets, ensuring an authentic taste that reminds you of home.
            </p>
            <h4 className="font-bold text-[#114D3C] mb-3">Allergen Information</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Prepared in a 100% vegetarian kitchen.</li>
              <li>May contain traces of gluten or dairy depending on the item.</li>
              <li>No artificial colors or preservatives added.</li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
