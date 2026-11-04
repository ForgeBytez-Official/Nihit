// Download a paper PDF to the client. Uses an anchor element so the browser
// handles the download natively — no fetch/blob dance, which keeps memory flat
// for multi-MB PDFs.

export interface DownloadOptions {
  filename?: string
}

export function downloadFile(url: string, options: DownloadOptions = {}): Promise<void> {
  const a = typeof document !== 'undefined' ? document.createElement('a') : null
  if (!a) return Promise.reject(new Error('No document available'))

  a.href = url
  a.rel = 'noopener'
  if (options.filename) a.download = options.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  return Promise.resolve()
}

export function paperDownloadUrl(paper: { id: string; pdf: string }): string {
  return paper.pdf
}

export function paperDownloadName(paper: { id: string }): string {
  return paper.id
}

export default { downloadFile, paperDownloadUrl, paperDownloadName }