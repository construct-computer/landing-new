import { useEffect, useRef } from "react"
import type { WorkflowDemo } from "./workflow-demos"
import { clamp, lerp, smoothStep } from "./workflow-motion"

export function WorkflowVideoLayer({
  demo,
  distance,
  isDominant,
  isVisible,
  media,
  travel = 10,
}: {
  demo: WorkflowDemo
  distance: number
  isDominant: boolean
  isVisible: boolean
  media: string
  travel?: number
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const wasDominantRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isDominant && !wasDominantRef.current) video.currentTime = 0
    wasDominantRef.current = isDominant

    if (isVisible && isDominant) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isDominant, isVisible])

  const exiting = smoothStep(clamp(-distance))
  const entering = smoothStep(clamp(1 - distance))
  const opacity = distance < 0 ? 1 - exiting : entering
  const translateY =
    distance < 0 ? lerp(0, travel, exiting) : lerp(-travel, 0, entering)

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      poster={demo.poster}
      aria-label={isDominant ? demo.ariaLabel : undefined}
      aria-hidden={!isDominant}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: Math.round(20 - Math.abs(distance) * 10),
      }}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={demo.video} type="video/webm" media={media} />
      <source src={demo.videoMp4} type="video/mp4" media={media} />
    </video>
  )
}
