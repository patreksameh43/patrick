import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, language } = useStore();

  if (!isSizeGuideOpen) return null;

  const sizeChart = [
    { size: 'S', chest: '118 cm', length: '71 cm', shoulder: '56 cm', heightRange: '165 - 173 cm' },
    { size: 'M', chest: '124 cm', length: '74 cm', shoulder: '59 cm', heightRange: '174 - 180 cm' },
    { size: 'L', chest: '130 cm', length: '77 cm', shoulder: '62 cm', heightRange: '181 - 187 cm' },
    { size: 'XL', chest: '136 cm', length: '80 cm', shoulder: '65 cm', heightRange: '188 - 194 cm' },
    { size: 'XXL', chest: '142 cm', length: '83 cm', shoulder: '68 cm', heightRange: '195+ cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xs"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="relative bg-neutral-950 border border-neutral-800 rounded-lg max-w-xl w-full p-6 text-neutral-100 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-neutral-400" />
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              {language === 'ar' ? 'دليل المقاسات والقصة المعمارية' : 'Architectural Fit & Size Guide'}
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="text-neutral-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fit Philosophy Note */}
        <div className="my-4 p-4 bg-neutral-900/60 border border-neutral-850 rounded text-xs text-neutral-300 leading-relaxed">
          <p className="font-semibold text-white mb-1">
            {language === 'ar' ? 'نمط قصة نوفا وير (Boxy Streetwear Fit):' : 'NOVA WEAR Fit Discipline:'}
          </p>
          <p>
            {language === 'ar'
              ? 'تصاميمنا مقصوصة عن قصد بقصة أوفرسايز بوكسي عريضة وأكتاف ساقطة. للحصول على القصة الواسعة الأصلية لعلامة نوفا وير، اختر مقاسك المعتاد. إذا كنت تفضل مقاساً أكثر ضبطاً على الجسم، ننصح باختيار مقاس واحد أصغر.'
              : 'Our garments are deliberately cut with an exaggerated boxy streetwear silhouette, wide drop shoulders, and dense drape. For the signature oversized look, choose your regular size. For a standard closer fit, size down one size.'}
          </p>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider">
                <th className="py-2.5 px-3">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                <th className="py-2.5 px-3">{language === 'ar' ? 'محيط الصدر' : 'Chest (Pit to Pit)'}</th>
                <th className="py-2.5 px-3">{language === 'ar' ? 'الطول' : 'Body Length'}</th>
                <th className="py-2.5 px-3">{language === 'ar' ? 'عرض الكتف' : 'Shoulder Width'}</th>
                <th className="py-2.5 px-3">{language === 'ar' ? 'الطول الموصى به' : 'Recommended Height'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300 font-mono tabular-nums">
              {sizeChart.map(row => (
                <tr key={row.size} className="hover:bg-neutral-900/40">
                  <td className="py-2.5 px-3 font-bold text-white">{row.size}</td>
                  <td className="py-2.5 px-3">{row.chest}</td>
                  <td className="py-2.5 px-3">{row.length}</td>
                  <td className="py-2.5 px-3">{row.shoulder}</td>
                  <td className="py-2.5 px-3 text-neutral-400">{row.heightRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors"
          >
            {language === 'ar' ? 'فهمت ذلك' : 'Got It'}
          </button>
        </div>
      </div>
    </div>
  );
};
