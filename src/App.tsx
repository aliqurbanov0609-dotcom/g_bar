import React, { useState, useRef } from 'react';
import './index.css';

export default function App() {
  // 'splash' — первый экран (shake_1.mp4), 'login' — переход/второй экран (shake_2.mp4)
  const [currentVideo, setCurrentVideo] = useState<'shake1' | 'shake2'>('shake1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Когда нажали кнопку "GO" на первом видео (shake_1.mp4)
  const handleGoClick = () => {
    setCurrentVideo('shake2'); // Переключаем на shake_2.mp4 с анимацией отдаления/испарения и шейкером
  };

  // Когда второе видео (shake_2.mp4) полностью проигрывается
  const handleVideoEnded = () => {
    if (currentVideo === 'shake2') {
      setIsLoggedIn(true); // Переходим на главный экран приложения / Login
    }
  };

  return (
    <div style={styles.container}>
      {!isLoggedIn ? (
        <div style={styles.videoWrapper}>
          <video
            ref={videoRef}
            src={currentVideo === 'shake1' ? '/assets/shake_1.mp4' : '/assets/shake_2.mp4'}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            style={styles.video}
          />

          {/* Кнопка GO показывается только пока играет первое видео */}
          {currentVideo === 'shake1' && (
            <button onClick={handleGoClick} style={styles.goButton}>
              GO &gt;&gt;&gt;&gt;
            </button>
          )}
        </div>
      ) : (
        <div style={styles.loginScreen}>
          {/* Ваш основной экран приложения или авторизации */}
          <h1 style={{ color: '#fff' }}>Welcome to Mixmaster</h1>
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
    position: 'relative' as const,
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  goButton: {
    position: 'absolute' as const,
    bottom: '12%',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '16px 48px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0, 114, 255, 0.5)',
  },
  loginScreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
};
