import { Paperclip, Send, X } from 'lucide-preact'
import type { JSX } from 'preact'
import { useRef, useState } from 'preact/hooks'
import type { UploadProgress } from '../hooks/useWidget'
import { useTranslation } from '../i18n'

interface MessageInputProps {
  onSend: (message: string, files?: File[]) => void
  isSending: boolean
  uploadProgress: UploadProgress | null
  primaryColor: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MessageInput({
  onSend,
  isSending,
  uploadProgress,
  primaryColor,
}: MessageInputProps): JSX.Element {
  const t = useTranslation()
  const [message, setMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const trimmed = message.trim()
    if ((trimmed || selectedFiles.length > 0) && !isSending) {
      onSend(trimmed, selectedFiles.length > 0 ? selectedFiles : undefined)
      setMessage('')
      setSelectedFiles([])
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(input.files!)])
      input.value = '' // Reset input
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const canSend = (message.trim() || selectedFiles.length > 0) && !isSending

  return (
    <div class="supprt-input-container">
      {uploadProgress && (
        <div
          class="supprt-upload-progress"
          role="progressbar"
          aria-valuenow={uploadProgress.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={-1}
        >
          <div class="supprt-upload-progress__info">
            <span class="supprt-upload-progress__filename">{uploadProgress.filename}</span>
            <span class="supprt-upload-progress__percent">{uploadProgress.progress}%</span>
          </div>
          <div class="supprt-upload-progress__bar">
            <div
              class="supprt-upload-progress__fill"
              style={{ width: `${uploadProgress.progress}%`, backgroundColor: primaryColor }}
            />
          </div>
        </div>
      )}
      {selectedFiles.length > 0 && (
        <div class="supprt-input__files">
          {selectedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} class="supprt-input__file">
              <span class="supprt-input__file-name">{file.name}</span>
              <span class="supprt-input__file-size">{formatFileSize(file.size)}</span>
              <button
                type="button"
                class="supprt-input__file-remove"
                onClick={() => removeFile(index)}
                aria-label="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <form class="supprt-input" onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          class="supprt-input__file-input"
          onChange={handleFileSelect}
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <button
          type="button"
          class="supprt-input__attach-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending}
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>
        <textarea
          ref={inputRef}
          class="supprt-input__textarea"
          value={message}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
          onKeyDown={handleKeyDown}
          placeholder={t.placeholder}
          rows={1}
          disabled={isSending}
        />
        <button
          type="submit"
          class="supprt-input__button"
          disabled={!canSend}
          style={{ backgroundColor: primaryColor }}
        >
          {isSending ? (
            <div class="supprt-spinner supprt-spinner--small" />
          ) : (
            <Send size={20} aria-hidden="true" />
          )}
        </button>
      </form>
    </div>
  )
}
