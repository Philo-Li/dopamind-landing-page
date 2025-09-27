'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Image from 'next/image';
import { getTranslation, type Locale } from '@/lib/i18n';

// --- 样式部分 ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    textAlign: 'center' as const,
    maxWidth: '400px',
    width: '100%',
  },
  logo: {
    width: '60px',
    height: '60px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
  },
  message: {
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  ctaButton: {
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#f97316',
    animation: 'spin 1s ease infinite',
    margin: '0 auto 20px auto',
  },
  icon: {
    fontSize: '36px',
    marginBottom: '16px',
  },
};

type VerificationStatus = 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const t = getTranslation(locale);
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [message, setMessage] = useState(t.verifyEmail.verifyingMessage);

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          // 使用环境变量中的后端API地址
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.dopamind.app';
          
          // 调用后端 API 验证邮箱 (使用GET请求，token作为查询参数)
          const response = await fetch(`${backendUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // 检查响应的Content-Type
          const contentType = response.headers.get('content-type');
          
          if (!contentType || !contentType.includes('application/json')) {
            // 如果不是JSON响应，可能是404或其他错误
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error(`API endpoint not found. Please check if the backend server is running on ${backendUrl}`);
          }

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Verification failed, please try again.');
          }

          setStatus('success');
          setMessage(t.verifyEmail.successMessage);
        } catch (error: unknown) {
          setStatus('error');
          const errorMessage = error instanceof Error ? error.message : t.verifyEmail.errorMessage;
          setMessage(errorMessage);
        }
      };
      verifyToken();
    } else {
      setStatus('error');
      setMessage(t.verifyEmail.missingTokenMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <div style={styles.spinner}></div>
            <h2 style={styles.title}>{t.verifyEmail.title}</h2>
            <p style={styles.message}>{message}</p>
          </>
        );
      case 'success':
        return (
          <>
            <div style={{...styles.icon, color: '#22c55e'}}>✅</div>
            <h2 style={styles.title}>{t.verifyEmail.titleSuccess}</h2>
            <p style={styles.message}>{message}</p>
            <a href="dopamind://" style={styles.ctaButton}>
              {t.verifyEmail.openApp}
            </a>
          </>
        );
      case 'error':
        return (
          <>
            <div style={{...styles.icon, color: '#ef4444'}}>❌</div>
            <h2 style={styles.title}>{t.verifyEmail.titleError}</h2>
            <p style={styles.message}>{message}</p>
          </>
        );
    }
  };

  return (
    <>
      <Image src="/dopamind-logo.png" alt="Dopamind Logo" width={60} height={60} style={styles.logo} />
      {renderContent()}
    </>
  );
}

export default function VerifyEmailPage() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const t = getTranslation(locale);

  return (
    <div style={styles.container}>
      <main style={styles.card}>
        <Suspense fallback={
          <>
            <Image src="/dopamind-logo.png" alt={t.verifyEmail.logoAlt} width={60} height={60} style={styles.logo} />
            <div style={styles.spinner}></div>
            <h2 style={styles.title}>{t.verifyEmail.loading}</h2>
            <p style={styles.message}>{t.verifyEmail.verifyingMessage}</p>
          </>
        }>
          <VerifyEmailContent />
        </Suspense>
      </main>
      
      {/* 内联 keyframes 动画，用于 spinner */}
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
