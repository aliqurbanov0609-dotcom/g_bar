import React, { useState, useRef, useEffect } from 'react';
import './index.css';

export default function App() {
  const [currentVideo, setCurrentVideo] = useState<'shake1' | 'shake2'>('shake1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Автозапуск видео при смене состояния
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay error:", err);
      });
    }
  }, [currentVideo]);

  // Клик по первому видео (где нарисована кнопка GO) переключает на второй экран
  const handleVideoClick = () => {
    if (currentVideo === 'shake1') {
      setCurrentVideo('shake2');
    }
  };

  // Когда второе видео (shake_2.mp4) доигрывает до конца — открываем Login Screen
  const handleVideoEnded = () => {
    if (currentVideo === 'shake2') {
      setIsLoggedIn(true);
    }
  };

  return (
    <div style={styles.container}>
      {!isLoggedIn ? (
        <div style={styles.videoWrapper} onClick={handleVideoClick}>
          <video
            ref={videoRef}
            key={currentVideo}
            src={currentVideo === 'shake1' ? '/shake_1.mp4' : '/shake_2.mp4'}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            style={styles.video}
          />
        </div>
      ) : (
        <div style={styles.loginScreen}>
          {/* Экран входа / Login Screen */}
          <h1 style={{ color: '#fff', fontFamily: 'sans-serif' }}>Login Screen</h1>
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
    cursor: 'pointer',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  loginScreen: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
};
