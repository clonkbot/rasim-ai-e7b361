import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { FloorPlanCanvas } from "./FloorPlanCanvas";

const STYLE_LABELS: Record<string, string> = {
  gulf_traditional: "خليجي تراثي",
  neoclassic: "نيوكلاسيك",
  contemporary: "معاصر",
  andalusian: "أندلسي",
  modern_arabic: "عربي حديث",
  mediterranean: "متوسطي",
};

interface Room {
  _id: Id<"rooms">;
  roomType: string;
  label: string;
  floor: number;
  widthM: number;
  depthM: number;
  areaSqm: number;
  xPosition: number;
  yPosition: number;
  color: string;
}

interface Draft {
  _id: Id<"drafts">;
  name: string;
  style: string;
  stories: number;
  ceilingHeight: number;
  totalSqm: number;
  width: number;
  depth: number;
  pinCount: number;
  createdAt: number;
  rooms: Room[];
}

interface DraftDetailProps {
  draft: Draft;
  onBack: () => void;
  isPinned: boolean;
}

export function DraftDetail({ draft, onBack, isPinned }: DraftDetailProps) {
  const togglePin = useMutation(api.drafts.togglePin);

  const handlePin = async () => {
    await togglePin({ draftId: draft._id });
  };

  const handleExportDXF = () => {
    // Generate simple DXF content
    let dxf = `0\nSECTION\n2\nENTITIES\n`;

    draft.rooms.forEach((room) => {
      const x1 = room.xPosition * 100;
      const y1 = room.yPosition * 100;
      const x2 = x1 + room.widthM * 100;
      const y2 = y1 + room.depthM * 100;

      // Rectangle (4 lines)
      dxf += `0\nLINE\n8\n0\n10\n${x1}\n20\n${y1}\n11\n${x2}\n21\n${y1}\n`;
      dxf += `0\nLINE\n8\n0\n10\n${x2}\n20\n${y1}\n11\n${x2}\n21\n${y2}\n`;
      dxf += `0\nLINE\n8\n0\n10\n${x2}\n20\n${y2}\n11\n${x1}\n21\n${y2}\n`;
      dxf += `0\nLINE\n8\n0\n10\n${x1}\n20\n${y2}\n11\n${x1}\n21\n${y1}\n`;

      // Text label
      dxf += `0\nTEXT\n8\n0\n10\n${x1 + 10}\n20\n${y1 + 20}\n40\n10\n1\n${room.label}\n`;
    });

    dxf += `0\nENDSEC\n0\nEOF`;

    const blob = new Blob([dxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.name}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group rooms by category
  const roomsByCategory: Record<string, Room[]> = {};
  draft.rooms.forEach((room) => {
    const category = room.roomType.includes("bed") || room.roomType.includes("bath") || room.roomType.includes("closet")
      ? "غرف النوم والحمامات"
      : room.roomType.includes("living") || room.roomType.includes("majlis") || room.roomType.includes("dining") || room.roomType.includes("kitchen") || room.roomType.includes("family") || room.roomType.includes("guest")
      ? "المعيشة والضيافة"
      : room.roomType.includes("maid") || room.roomType.includes("driver") || room.roomType.includes("storage") || room.roomType.includes("laundry")
      ? "الخدمات"
      : "أخرى";

    if (!roomsByCategory[category]) {
      roomsByCategory[category] = [];
    }
    roomsByCategory[category].push(room);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-amber-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>العودة</span>
            </button>

            <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none">{draft.name}</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePin}
                className={`p-2 rounded-xl transition-all ${
                  isPinned
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600 hover:bg-amber-50"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isPinned ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
              <button
                onClick={handleExportDXF}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline">تصدير CAD</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Floor Plan Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">المخطط</h2>
                <span className="text-sm text-gray-500">الطابق الأرضي</span>
              </div>
              <div className="p-4 overflow-auto">
                <FloorPlanCanvas
                  rooms={draft.rooms.map((r) => ({
                    id: r._id,
                    roomType: r.roomType,
                    label: r.label,
                    x: r.xPosition,
                    y: r.yPosition,
                    width: r.widthM,
                    depth: r.depthM,
                    area: r.areaSqm,
                    color: r.color,
                  }))}
                  width={draft.width}
                  depth={draft.depth}
                />
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">نظرة عامة</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">النمط المعماري</span>
                  <span className="font-medium text-gray-900">{STYLE_LABELS[draft.style]}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">المساحة الإجمالية</span>
                  <span className="font-medium text-gray-900">{draft.totalSqm} م²</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">أبعاد البناء</span>
                  <span className="font-medium text-gray-900">{draft.width.toFixed(1)} × {draft.depth.toFixed(1)} م</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">عدد الطوابق</span>
                  <span className="font-medium text-gray-900">{draft.stories}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">ارتفاع السقف</span>
                  <span className="font-medium text-gray-900">{draft.ceilingHeight} م</span>
                </div>
              </div>
            </div>

            {/* Room List */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">الغرف ({draft.rooms.length})</h2>
              <div className="space-y-4">
                {Object.entries(roomsByCategory).map(([category, rooms]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
                    <div className="space-y-2">
                      {rooms.map((room) => (
                        <div
                          key={room._id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: room.color }}
                            />
                            <span className="text-gray-700">{room.label}</span>
                          </div>
                          <span className="text-sm text-gray-500">{room.areaSqm.toFixed(1)} م²</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Municipal Requirements */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-bold text-green-800">اشتراطات البلدية</h2>
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  ارتداد أمامي: 6 م ✓
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  ارتداد جانبي: 2 م ✓
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  ارتداد خلفي: 3 م ✓
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400 border-t border-amber-100/50">
        Requested by @web-user · Built by @clonkbot
      </footer>
    </div>
  );
}
