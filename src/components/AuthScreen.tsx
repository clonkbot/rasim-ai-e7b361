import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("حدث خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden" dir="rtl">
      {/* Decorative patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-300/20 to-orange-400/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-rose-300/20 to-amber-300/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>

        {/* Islamic geometric pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="1"/>
              <path d="M15 15L45 15L45 45L15 45Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" className="text-amber-900"/>
        </svg>
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="max-w-xl text-center lg:text-right">
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-amber-100">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">رسم.ai</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              صمّم منزل <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">أحلامك</span> بالذكاء الاصطناعي
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              أنشئ مخططات احترافية في دقائق. لا خبرة هندسية مطلوبة.
              <br />
              <span className="text-amber-700 font-medium">مُصمم خصيصاً للسوق السعودي والخليجي</span>
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                اشتراطات البلدية السعودية
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                أنماط معمارية خليجية
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                تصدير CAD احترافي
              </div>
            </div>

            {/* Sample floor plan preview */}
            <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-100">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "مجلس", color: "bg-blue-100", size: "col-span-2 row-span-2" },
                  { name: "مطبخ", color: "bg-yellow-100", size: "col-span-1" },
                  { name: "طعام", color: "bg-green-100", size: "col-span-1" },
                  { name: "غرفة نوم", color: "bg-rose-100", size: "col-span-1" },
                  { name: "حمام", color: "bg-purple-100", size: "col-span-1" },
                  { name: "معيشة", color: "bg-teal-100", size: "col-span-2" },
                  { name: "غرفة نوم", color: "bg-rose-100", size: "col-span-1" },
                  { name: "حمام", color: "bg-purple-100", size: "col-span-1" },
                ].map((room, i) => (
                  <div key={i} className={`${room.color} ${room.size} rounded-lg p-2 flex items-center justify-center text-xs font-medium text-gray-700 border border-gray-200`}>
                    {room.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-100 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {flow === "signIn" ? "مرحباً بعودتك" : "إنشاء حساب جديد"}
                </h2>
                <p className="text-gray-500">
                  {flow === "signIn" ? "سجل دخولك للمتابعة" : "ابدأ رحلة تصميم منزلك"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-right bg-white"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-right bg-white"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>

                <input type="hidden" name="flow" value={flow} />

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {flow === "signIn" ? "تسجيل الدخول" : "إنشاء حساب"}
                      <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-400">أو</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                onClick={handleAnonymous}
                disabled={isLoading}
                className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                تجربة كزائر
              </button>

              <p className="mt-6 text-center text-sm text-gray-500">
                {flow === "signIn" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
                <button
                  type="button"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                  className="text-amber-600 hover:text-amber-700 font-medium mr-1"
                >
                  {flow === "signIn" ? "إنشاء حساب" : "تسجيل الدخول"}
                </button>
              </p>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center text-xs text-gray-400">
              Requested by @web-user · Built by @clonkbot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
