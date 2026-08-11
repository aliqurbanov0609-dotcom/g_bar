import { useRef, useState } from 'react';

interface Props {
  onFinish: () => void;
}

export default function VideoSplash({ onFinish }: Props) {
  const transitionRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<'splash' | 'transition'>('splash')

  const handleGo = async () => {
    setPhase('transition')

    requestAnimationFrame(async () => {
      await transitionRef.current?.play()
    })
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      {phase === 'splash' ? (
        <div className="relative w-full h-full">
          <video
            src="/shake_1.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
          />

          <button
            onClick={handleGo}
            className="absolute bottom-16 left-1/2 -translate-x-1/2
                       px-8 py-4 rounded-full
                       bg-orange-500 text-white font-bold text-xl
                       shadow-[0_0_25px_rgba(255,140,0,0.8)]
                       active:scale-95 transition-all"
          >
            GO >>>>
          </button>
        </div>
      ) : (
        <video
          ref={transitionRef}
          src="/shake_2.mp4"
          autoPlay
          muted
          playsInline
          onEnded={onFinish}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  )
}
