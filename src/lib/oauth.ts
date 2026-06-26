"use client";

/**
 * Client helpers to obtain a provider ID token, which is then exchanged for a
 * PlayStudy session via /api/auth/provider. Credentials are supplied through
 * env (NEXT_PUBLIC_GOOGLE_CLIENT_ID / NEXT_PUBLIC_APPLE_CLIENT_ID); when they
 * are absent the helpers throw a friendly, user-facing error so the buttons
 * degrade gracefully until OAuth is configured.
 */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load sign-in script"));
    document.head.appendChild(s);
  });
}

export async function googleIdToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Google sign-in isn't configured yet.");
  }
  await loadScript("https://accounts.google.com/gsi/client");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const google = (window as any).google;
  if (!google?.accounts?.id) throw new Error("Google sign-in failed to load.");

  return new Promise<string>((resolve, reject) => {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (resp: { credential?: string }) => {
        if (resp?.credential) resolve(resp.credential);
        else reject(new Error("Google sign-in was cancelled."));
      },
    });
    google.accounts.id.prompt((notif: any) => {
      if (notif?.isNotDisplayed?.() || notif?.isSkippedMoment?.()) {
        reject(new Error("Google sign-in was dismissed."));
      }
    });
  });
}

export async function appleIdToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Apple sign-in isn't configured yet.");
  }
  await loadScript(
    "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AppleID = (window as any).AppleID;
  if (!AppleID?.auth) throw new Error("Apple sign-in failed to load.");

  AppleID.auth.init({
    clientId,
    scope: "name email",
    redirectURI: window.location.origin,
    usePopup: true,
  });
  const res = await AppleID.auth.signIn();
  const token = res?.authorization?.id_token;
  if (!token) throw new Error("Apple sign-in was cancelled.");
  return token;
}
