import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const ROOM_CATALOG = {
  "غرف النوم والحمامات": [
    { id: "master_bedroom", label: "غرفة النوم الرئيسية", icon: "🛏️" },
    { id: "bedroom", label: "غرفة نوم", icon: "🛏️" },
    { id: "master_bath", label: "حمام رئيسي", icon: "🚿" },
    { id: "bathroom", label: "حمام", icon: "🚿" },
    { id: "walk_in_closet", label: "غرفة ملابس", icon: "👔" },
  ],
  "المعيشة والضيافة": [
    { id: "majlis", label: "مجلس", icon: "🛋️" },
    { id: "living_room", label: "غرفة معيشة", icon: "🛋️" },
    { id: "dining_room", label: "غرفة طعام", icon: "🍽️" },
    { id: "kitchen", label: "مطبخ", icon: "🍳" },
    { id: "family_room", label: "غرفة عائلية", icon: "📺" },
    { id: "guest_room", label: "غرفة ضيوف", icon: "🛏️" },
  ],
  "الخدمات": [
    { id: "maid_room", label: "غرفة خادمة", icon: "🏠" },
    { id: "driver_room", label: "غرفة سائق", icon: "🚗" },
    { id: "storage", label: "مستودع", icon: "📦" },
    { id: "laundry", label: "غرفة غسيل", icon: "🧺" },
  ],
  "المساحات الخارجية": [
    { id: "garage", label: "مرآب", icon: "🚗" },
    { id: "garden", label: "حديقة", icon: "🌿" },
    { id: "pool", label: "مسبح", icon: "🏊" },
    { id: "courtyard", label: "فناء داخلي", icon: "☀️" },
  ],
  "غرف متخصصة": [
    { id: "home_office", label: "مكتب منزلي", icon: "💼" },
    { id: "prayer_room", label: "غرفة صلاة", icon: "🕌" },
    { id: "gym", label: "صالة رياضية", icon: "💪" },
    { id: "media_room", label: "غرفة سينما", icon: "🎬" },
  ],
};

const ARCHITECTURAL_STYLES = [
  { id: "gulf_traditional", label: "خليجي تراثي", desc: "أقواس، نقوش، أبراج هواء" },
  { id: "neoclassic", label: "نيوكلاسيك", desc: "أعمدة كلاسيكية، فخامة رسمية" },
  { id: "contemporary", label: "معاصر", desc: "خطوط نظيفة، زجاج، بساطة" },
  { id: "andalusian", label: "أندلسي", desc: "فناء داخلي، أقواس، نافورة" },
  { id: "modern_arabic", label: "عربي حديث", desc: "مزج التراث بالحداثة" },
  { id: "mediterranean", label: "متوسطي", desc: "أسقف مائلة، طلاء أبيض" },
];

interface CreateDraftModalProps {
  onClose: () => void;
  onCreated: (id: Id<"drafts">) => void;
}

export function CreateDraftModal({ onClose, onCreated }: CreateDraftModalProps) {
  const [step, setStep] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({
    master_bedroom: 1,
    bedroom: 2,
    bathroom: 2,
    kitchen: 1,
    living_room: 1,
    dining_room: 1,
  });
  const [totalSqm, setTotalSqm] = useState(300);
  const [style, setStyle] = useState("contemporary");
  const [stories, setStories] = useState(1);
  const [ceilingHeight, setCeilingHeight] = useState(3.2);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createDraft = useMutation(api.drafts.create);

  const handleRoomToggle = (roomId: string) => {
    setSelectedRooms((prev) => {
      const current = prev[roomId] || 0;
      if (current === 0) {
        return { ...prev, [roomId]: 1 };
      }
      return { ...prev, [roomId]: 0 };
    });
  };

  const handleRoomCount = (roomId: string, delta: number) => {
    setSelectedRooms((prev) => {
      const current = prev[roomId] || 0;
      const newCount = Math.max(0, Math.min(10, current + delta));
      return { ...prev, [roomId]: newCount };
    });
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const rooms = Object.entries(selectedRooms)
        .filter(([_, count]) => count > 0)
        .map(([roomType, count]) => ({ roomType, count }));

      const id = await createDraft({
        name: name || `تصميم ${new Date().toLocaleDateString("ar-SA")}`,
        style,
        stories,
        ceilingHeight,
        totalSqm,
        rooms,
      });
      onCreated(id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const totalRooms = Object.values(selectedRooms).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">إنشاء مخطط جديد</h2>
            <p className="text-sm text-gray-500">الخطوة {step} من 3</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  s <= step ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">اختر غرف منزلك</h3>
                <p className="text-gray-500">انقر لإضافة أو استخدم + و - لتعديل العدد</p>
              </div>

              {Object.entries(ROOM_CATALOG).map(([category, rooms]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">{category}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {rooms.map((room) => {
                      const count = selectedRooms[room.id] || 0;
                      const isSelected = count > 0;
                      return (
                        <div
                          key={room.id}
                          className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer ${
                            isSelected
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-200 hover:border-amber-200 bg-white"
                          }`}
                          onClick={() => handleRoomToggle(room.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{room.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{room.label}</span>
                          </div>
                          {isSelected && (
                            <div
                              className="mt-2 flex items-center justify-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleRoomCount(room.id, -1)}
                                className="w-6 h-6 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center text-amber-700 text-sm font-bold"
                              >
                                -
                              </button>
                              <span className="text-sm font-bold text-amber-700 w-6 text-center">{count}</span>
                              <button
                                onClick={() => handleRoomCount(room.id, 1)}
                                className="w-6 h-6 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center text-amber-700 text-sm font-bold"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">اختر النمط والمساحة</h3>
              </div>

              {/* Architectural Style */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">النمط المعماري</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ARCHITECTURAL_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-4 rounded-xl border-2 text-right transition-all ${
                        style === s.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-200"
                      }`}
                    >
                      <div className="font-medium text-gray-900">{s.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  المساحة الإجمالية: <span className="text-amber-600">{totalSqm} م²</span>
                </label>
                <input
                  type="range"
                  min="150"
                  max="800"
                  step="10"
                  value={totalSqm}
                  onChange={(e) => setTotalSqm(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>١٥٠ م²</span>
                  <span>٨٠٠ م²</span>
                </div>
              </div>

              {/* Stories & Ceiling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">عدد الطوابق</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        onClick={() => setStories(n)}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                          stories === n
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-200 hover:border-amber-200 text-gray-600"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">ارتفاع السقف</label>
                  <div className="flex gap-2">
                    {[3.0, 3.2, 3.5].map((h) => (
                      <button
                        key={h}
                        onClick={() => setCeilingHeight(h)}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                          ceilingHeight === h
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-200 hover:border-amber-200 text-gray-600"
                        }`}
                      >
                        {h} م
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">أخيراً، سمّ تصميمك</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم التصميم</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: فيلا الحلم"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h4 className="font-bold text-gray-900 mb-4">ملخص التصميم</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">النمط:</span>
                    <span className="text-gray-900 font-medium mr-2">
                      {ARCHITECTURAL_STYLES.find((s) => s.id === style)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">المساحة:</span>
                    <span className="text-gray-900 font-medium mr-2">{totalSqm} م²</span>
                  </div>
                  <div>
                    <span className="text-gray-500">الطوابق:</span>
                    <span className="text-gray-900 font-medium mr-2">{stories}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">الغرف:</span>
                    <span className="text-gray-900 font-medium mr-2">{totalRooms} غرفة</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors font-medium"
            >
              السابق
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && totalRooms === 0}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              التالي
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  إنشاء المخطط
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
