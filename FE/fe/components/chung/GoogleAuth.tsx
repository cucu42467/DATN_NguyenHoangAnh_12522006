"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            ux_mode?: string;
            callback: (res: { credential?: string }) => void;
          }) => void;
          prompt: (cb: (notif: {
            isNotDisplayed?: () => boolean;
            getNotDisplayedReason?: () => string;
          }) => void) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "935046790513-0khvggnidigo8npboodl3koves9mte5a.apps.googleusercontent.com";

let promise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (promise) return promise;
  console.log("[GoogleAuth] loadScript()");


  promise = new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();

    if (window.google?.accounts?.id) return resolve();

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => {
      console.error("Google script load failed");
      resolve();
    };

    document.head.appendChild(script);
  });

  return promise;
}

export async function loginGoogleIdToken(
  onSuccess: (idToken: string) => void,
  onError?: (msg: string) => void
) {
  await loadScript();

  const id = window.google?.accounts?.id;
  console.log("[GoogleAuth] token flow start");

  if (!id) {
    onError?.("Google Identity chưa load");
    return;
  }

  console.log("[GoogleAuth] gsi client ready, initializing");

  id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    ux_mode: "popup",
    callback: (res) => {
      console.log("[GoogleAuth] callback fired", res);
      if (res?.credential) onSuccess(res.credential);
      else onError?.("Không nhận được idToken");
    },
  });

  // Đảm bảo popup/selection được hiển thị (một số môi trường cần prompt).
  console.log("[GoogleAuth] calling prompt()");
  try {
    id.prompt((notif) => {
      console.log("[GoogleAuth] prompt notif", notif);
      if (notif?.isNotDisplayed?.()) {
        const reason = notif.getNotDisplayedReason?.();
        onError?.(reason || "Google không hiển thị hộp chọn đăng nhập");
      }
    });
  } catch (e: any) {
    console.error("[GoogleAuth] prompt error", e);
    onError?.(e?.message || "Lỗi khi mở popup Google");
  }

}



export function useGoogleAuth() {
  useEffect(() => {
    loadScript();
  }, []);
}

