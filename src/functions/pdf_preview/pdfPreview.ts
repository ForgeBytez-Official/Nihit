// PDF preview logic. A paper's PDF is served as a static asset URL; this
// module centralizes the URL resolution and the "open in new tab" fallback
// so the preview component stays thin.

export interface PdfPreviewOptions {
  page?: number
  zoom?: number
}

export function pdfPreviewUrl(paperPdf: string, options: PdfPreviewOptions = {}): string {
  if (!paperPdf) return ''
  if (options.page && options.page > 1) {
    return `${paperPdf}#page=${options.page}`
  }
  if (options.zoom && options.zoom !== 1) {
    return `${paperPdf}#zoom=${Math.round(options.zoom * 100)}`
  }
  return paperPdf
}

export function openPdfInTab(url: string, target = '_blank'): Window | null {
  return window.open(url, target, 'noopener,noreferrer')
}

export default { pdfPreviewUrl, openPdfInTab }