import type { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useTranslation } from '../i18n'

interface ImagePreviewProps {
  src: string
  alt?: string
}

export function ImagePreview({ src, alt = '' }: ImagePreviewProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslation()

  return (
    <>
      <button
        type="button"
        class="supprt-image-preview"
        onClick={() => setIsOpen(true)}
        aria-label={t.viewImage}
      >
        <img src={src} alt={alt} loading="lazy" />
      </button>

      {isOpen && <ImageLightbox src={src} alt={alt} onClose={() => setIsOpen(false)} />}
    </>
  )
}

interface ImageLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

function ImageLightbox({ src, alt, onClose }: ImageLightboxProps): JSX.Element {
  const t = useTranslation()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus the close button when lightbox opens and handle Escape
  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      class="supprt-lightbox"
      role="dialog"
      aria-label={t.imagePreview}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }}
    >
      <button
        ref={closeButtonRef}
        class="supprt-lightbox__close"
        onClick={onClose}
        type="button"
        aria-label={t.closeImage}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <img class="supprt-lightbox__image" src={src} alt={alt} />
    </div>
  )
}
