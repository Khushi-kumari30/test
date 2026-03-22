import React from 'react'

export default function PdfDropZone(props: {
  onFiles: (files: File[]) => void
  disabled?: boolean
  hint?: string
}): React.ReactElement

