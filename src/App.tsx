import React, { useState, useRef, useEffect } from 'react';
import './index.css';

type Screen = 'shake1' | 'shake2' | 'pin1' | 'pin2' | 'app';

export default function App() {
  const [screen, setScreen] = useState<Screen>('shake1')
  const [pin, setPin] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && screen !== 'app') {
      videoRef.current.play().catch(() => {})
    }
  }, [screen])

  const handleClick = () => {
    if (screen === 'shake1') {
      setScreen('shake2')
    }

    if (screen === 'pin1' && pin === '0609') {
      setScreen('pin2')
    }
  }

  const handleEnded = () => {
    if (screen === 'shake2') {
      setScreen('pin1')
    }

    if (screen === 'pin2') {
      setScreen('app')
    }
  }

  if (screen === 'app') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">G-BAR MAIN MENU</h1>
      </div>
    )
  }

  if (screen === 'pin1') {
    return (
      <div style={styles.container}>
        <video
          ref={videoRef}
          src="/pin_1.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={styles.video}
        />

        <div style={styles.pinOverlay}>
          <input
            type="password"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, ''))
            }
            maxLength={4}
            placeholder="0609"
            style={styles.hiddenInput}
          />

          <div style={styles.goArea} onClick={handleClick} />
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container} onClick={handleClick}>
      <video
        ref={videoRef}
        key={screen}
        src={screen === 'shake1' ? '/shake_1.mp4' : '/shake_2.mp4'}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        style={styles.video}
      />
    </div>
  )
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'fixed' as const,
    inset: 0,
  },

  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },

  pinOverlay: {
    position: 'absolute' as const,
    inset: 0,
  },

  hiddenInput: {
    position: 'absolute' as const,
    top: '58%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120px',
    height: '40px',
    opacity: 0.02,
    background: 'transparent',
    border: 'none',
    color: 'white',
    textAlign: 'center' as const,
    fontSize: '24px',
    outline: 'none',
  },

  goArea: {
    position: 'absolute' as const,
    bottom: '12%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '220px',
    height: '70px',
    background: 'transparent',
  },
}
