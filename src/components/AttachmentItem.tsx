import { Download, Paperclip } from 'lucide-preact'
import type { JSX } from 'preact'
import { useState } from 'preact/hooks'
import type { Attachment } from '../types'

interface AttachmentItemProps {
  attachment: Attachment
  onDownload?: (attachmentId: string) => Promise<string>
}

export function AttachmentItem({ attachment, onDownload }: AttachmentItemProps): JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!onDownload || isDownloading) return
    setIsDownloading(true)
    try {
      const downloadUrl = await onDownload(attachment.id)
      window.open(downloadUrl, '_blank')
    } catch (error) {
      console.error('[Supprt] Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      type="button"
      class="supprt-attachment"
      onClick={handleDownload}
      disabled={isDownloading || !onDownload}
    >
      {isDownloading ? (
        <div class="supprt-spinner supprt-spinner--tiny" />
      ) : (
        <Download size={16} aria-hidden="true" />
      )}
      <span class="supprt-attachment__name">{attachment.filename}</span>
      <Paperclip size={14} class="supprt-attachment__icon" aria-hidden="true" />
    </button>
  )
}
