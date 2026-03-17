import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CreateDraftModal } from "./CreateDraftModal";
import { DraftCard, Draft } from "./DraftCard";
import { DraftDetail } from "./DraftDetail";
import { Id } from "../../convex/_generated/dataModel";

type Tab = "create" | "studio" | "explore";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<Id<"drafts"> | null>(null);

  const myDrafts = useQuery(api.drafts.list);
  const publicDrafts = useQuery(api.drafts.listPublic);
  const stats = useQuery(api.drafts.getStats);
  const userPins = useQuery(api.drafts.getUserPins);

  const selectedDraft = useQuery(
    api.drafts.get,
    selectedDraftId ? { id: selectedDraftId } : "skip"
  );

  if (selectedDraft) {
    return (
      <DraftDetail
        draft={selectedDraft}
        onBack={() => setSelectedDraftId(null)}
        isPinned={userPins?.includes(selectedDraftId!) ?? false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent hidden sm:block">رسم.ai</span>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1 bg-amber-100/50 rounded-xl p-1">
              {[
                { id: "create" as Tab, label: "إنشاء", icon: "M12 4v16m8-8H4" },
                { id: "studio" as Tab, label: "استوديو", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
                { id: "explore" as Tab, label: "استكشف", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-gray-600 hover:text-amber-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Sign Out */}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm"
            >
              <span className="hidden sm:inline">تسجيل الخروج</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "create" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                صمّم مخطط منزلك
              </h1>
              <p className="text-gray-600 text-lg">
                اختر الغرف والنمط المعماري وسنقوم بإنشاء مخطط احترافي لك
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-amber-100">
                <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  {stats?.totalDrafts.toLocaleString("ar-SA") ?? "٠"}
                </span>
                <span className="text-gray-600">تصميم تم إنشاؤه حتى الآن</span>
              </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إنشاء مخطط جديد
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: "🕌",
                  title: "أنماط معمارية خليجية",
                  desc: "خليجي تراثي، نيوكلاسيك، معاصر، أندلسي والمزيد",
                },
                {
                  icon: "📐",
                  title: "اشتراطات البلدية",
                  desc: "مطابق لاشتراطات وزارة الشؤون البلدية السعودية",
                },
                {
                  icon: "📤",
                  title: "تصدير CAD",
                  desc: "حمّل ملف DXF جاهز للمكاتب الهندسية",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 hover:border-amber-200 hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "studio" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">تصاميمي</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إنشاء جديد
              </button>
            </div>

            {myDrafts === undefined ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              </div>
            ) : myDrafts.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد تصاميم بعد</h3>
                <p className="text-gray-500 mb-6">ابدأ بإنشاء أول مخطط لمنزلك</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2 px-6 rounded-xl"
                >
                  إنشاء مخطط
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDrafts.map((draft: Draft) => (
                  <DraftCard
                    key={draft._id}
                    draft={draft}
                    onClick={() => setSelectedDraftId(draft._id)}
                    isPinned={userPins?.includes(draft._id) ?? false}
                    showDelete
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "explore" && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">استكشف التصاميم</h2>
              <p className="text-gray-600">تصفح مخططات المنازل من المجتمع للإلهام</p>
            </div>

            {publicDrafts === undefined ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              </div>
            ) : publicDrafts.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد تصاميم عامة بعد</h3>
                <p className="text-gray-500">كن أول من يشارك تصميمه!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicDrafts.map((draft: Draft) => (
                  <DraftCard
                    key={draft._id}
                    draft={draft}
                    onClick={() => setSelectedDraftId(draft._id)}
                    isPinned={userPins?.includes(draft._id) ?? false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-xs text-gray-400 border-t border-amber-100/50">
        Requested by @web-user · Built by @clonkbot
      </footer>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateDraftModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(id) => {
            setShowCreateModal(false);
            setSelectedDraftId(id);
          }}
        />
      )}
    </div>
  );
}
