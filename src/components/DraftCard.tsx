import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const STYLE_LABELS: Record<string, string> = {
  gulf_traditional: "خليجي تراثي",
  neoclassic: "نيوكلاسيك",
  contemporary: "معاصر",
  andalusian: "أندلسي",
  modern_arabic: "عربي حديث",
  mediterranean: "متوسطي",
};

const STYLE_COLORS: Record<string, string> = {
  gulf_traditional: "from-amber-400 to-orange-500",
  neoclassic: "from-slate-400 to-gray-600",
  contemporary: "from-cyan-400 to-blue-500",
  andalusian: "from-rose-400 to-pink-500",
  modern_arabic: "from-emerald-400 to-teal-500",
  mediterranean: "from-sky-400 to-indigo-500",
};

export interface Draft {
  _id: Id<"drafts">;
  name: string;
  style: string;
  stories: number;
  totalSqm: number;
  pinCount: number;
  createdAt: number;
}

interface DraftCardProps {
  draft: Draft;
  onClick: () => void;
  isPinned: boolean;
  showDelete?: boolean;
}

export function DraftCard({ draft, onClick, isPinned, showDelete }: DraftCardProps) {
  const togglePin = useMutation(api.drafts.togglePin);
  const deleteDraft = useMutation(api.drafts.remove);

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await togglePin({ draftId: draft._id });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("هل أنت متأكد من حذف هذا التصميم؟")) {
      await deleteDraft({ id: draft._id });
    }
  };

  const gradientClass = STYLE_COLORS[draft.style] || "from-gray-400 to-gray-600";

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Preview */}
      <div className={`relative h-40 bg-gradient-to-br ${gradientClass} p-4`}>
        {/* Decorative floor plan pattern */}
        <div className="absolute inset-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden">
          <div className="grid grid-cols-3 grid-rows-2 gap-1 p-2 h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/30 rounded"
                style={{
                  gridColumn: i === 0 ? "span 2" : undefined,
                  gridRow: i === 0 ? "span 2" : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="absolute top-3 left-3 flex gap-2">
          <button
            onClick={handlePin}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isPinned
                ? "bg-amber-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white"
            }`}
          >
            <svg
              className="w-4 h-4"
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
          {showDelete && (
            <button
              onClick={handleDelete}
              className="w-8 h-8 rounded-full bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Style badge */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {STYLE_LABELS[draft.style] || draft.style}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 truncate">{draft.name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            <span>{draft.totalSqm} م²</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>{draft.stories} طابق</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span>{draft.pinCount}</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          {new Date(draft.createdAt).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
