import React, { useState, useRef, useEffect } from 'react';
import './index.css';
type VideoState = 'shake1' | 'shake2' | 'login';
export default function App() {
  const [screen, setScreen] = useState<VideoState>('shake1');
  const [transitioning, setTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Автозапуск видео
  useEffect(() => {
    if (videoRef.current && screen !== 'login') {
      videoRef.current
        .play()
        .catch(() => {});
    }
  }, [screen]);
  // Нажатие на первый splash экран
  const handleSplashClick = () => {
    if (screen !== 'shake1' || transitioning) return;
    setTransitioning(true);
    // Небольшая задержка для плавного fade/zoom эффекта
    setTimeout(() => {
      setScreen('shake2');
      setTransitioning(false);
    }, 500);
  };
  // После окончания второго видео открываем Login Screen
  const handleVideoEnded = () => {
    if (screen === 'shake2') {
      setScreen('login');
    }
  };
  return (
    <div style={styles.container}>
      {screen !== 'login' ? (
        <div
          style={{
            ...styles.videoWrapper,
            ...(screen === 'shake1' ? styles.clickable : {}),
          }}
          onClick={handleSplashClick}
        >
          <video
            ref={videoRef}
            key={screen}
            src={screen === 'shake1' ? '/shake_1.mp4' : '/shake_2.mp4'}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            style={{
              ...styles.video,
              ...(transitioning ? styles.fadeZoomOut : {}),
              ...(screen === 'shake2' ? styles.zoomIn : {}),
            }}
          />
        </div>
      ) : (
        <div style={styles.loginScreen}>
          <div style={styles.loginCard}>
            <h1 style={styles.title}>G-BAR</h1>
            <p style={styles.subtitle}>Login Screen</p>
            <input
              type="password"
              placeholder="PIN CODE"
              style={styles.input}
            />
            <button style={styles.loginButton}>ENTER</button>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'fixed' as const,
    top: 0,
    left: 0,
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    backgroundColor: '#000',
  },
  clickable: {
    cursor: 'pointer',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.5s ease, opacity 0.5s ease',
    transform: 'scale(1)',
    opacity: 1,
  },
  // Первый экран плавно отдаляется и исчезает
  fadeZoomOut: {
    transform: 'scale(0.92)',
    opacity: 0,
  },
  // Второй экран плавно приближается
  zoomIn: {
    animation: 'zoomInEffect 0.8s ease-out',
  },
  loginScreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #050505 0%, #111 100%)',
    padding: '24px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '340px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '28px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
    backdropFilter: 'blur(18px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
  },
  title: {
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '32px',
    fontWeight: 800,
    textAlign: 'center' as const,
    margin: 0,
    letterSpacing: '0.08em',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    textAlign: 'center' as const,
    margin: 0,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  loginButton: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff8a00 0%, #ff5a00 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(255,106,0,0.35)',
  },
};
