'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'

// Gebruik lokale worker uit /public map
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface PdfThumbnailProps {
  fileUrl: string
}

export default function PdfThumbnail({ fileUrl }: PdfThumbnailProps) {
  const [numPages, setNumPages] = useState<number | null>(null)

  return (
    <div className="w-full h-32 overflow-hidden rounded bg-gray-100">
      <Document
        file={{ url: fileUrl }}
        loading="Bezig met laden..."
        error={
          <div className="text-sm text-red-500 text-center py-4">
            PDF preview mislukt
          </div>
        }
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={1} width={300} />
      </Document>
    </div>
  )
}
