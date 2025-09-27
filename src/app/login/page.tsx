"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocalization } from '@/hooks/useLocalization';

const fullyDecode = (raw: string): string => {
  let current = raw;
  while (true) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) {
        return current;
      }
      current = next;
    } catch {
      return current;
    }
  }
};

const sanitizeRedirectTarget = (rawRedirect: string | null, fallbackBase: string): string => {
  const trimmedBase = fallbackBase.replace(/\/$/, "");
  const fallback = `${trimmedBase}/dashboard`;

  if (!rawRedirect) {
    return fallback;
  }

  const decoded = fullyDecode(rawRedirect).trim();
  if (!decoded) {
    return fallback;
  }

  if (decoded.startsWith("/")) {
    return `${trimmedBase}${decoded}`;
  }

  try {
    const baseForUrl = new URL(`${trimmedBase}/`);
    const candidate = new URL(decoded, baseForUrl);
    const baseHost = baseForUrl.hostname;
    const candidateHost = candidate.hostname;
    const hostParts = baseHost.split(".");
    const allowedSuffix = hostParts.length >= 2 ? hostParts.slice(-2).join(".") : baseHost;

    const isAllowedHost =
      candidateHost === baseHost ||
      candidateHost === allowedSuffix ||
      candidateHost.endsWith(`.${allowedSuffix}`);

    if (isAllowedHost) {
      return candidate.toString();
    }
  } catch (error) {
    console.warn("Invalid redirect parameter ignored", error);
  }

  return fallback;
};

export default function LoginRedirectPage() {
  const searchParams = useSearchParams();
  const { t } = useLocalization();

  const landingBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "https://dopamind.app";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const loginTarget = new URL("/login", landingBase);
      const redirectParam = searchParams?.get("redirect") ?? window.location.href;
      const sanitized = sanitizeRedirectTarget(redirectParam, landingBase);
      loginTarget.searchParams.set("redirect", sanitized);

      window.location.replace(loginTarget.toString());
    } catch (error) {
      console.error("Failed to redirect to landing login:", error);
      window.location.replace(landingBase);
    }
  }, [landingBase, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dopamind-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">{t('auth.login.redirecting')}</p>
      </div>
    </div>
  );
}
