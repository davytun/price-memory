"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      // Optional: Can show a toast here like "App Installed!"
      console.log("PWA was installed");
    };

    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-md mx-auto bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50" />

        <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400">
          <Download size={24} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-white">Install App</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Add to home screen for offline use
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <button
            onClick={handleInstallClick}
            className="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
