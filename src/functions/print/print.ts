// Print view for a paper. Opens the paper's PDF in a new tab so the browser's
// native print dialog handles it — no iframe/HTML reconstruction needed.

export function openPrintTab(url: string, target = '_blank'): Window | null {
  return window.open(url, target, 'noopener,noreferrer')
}

export function printPaper(url: string): Promise<void> {
  const w = openPrintTab(url)
  if (!w) return Promise.reject(new Error('Print window blocked'))
  return new Promise((resolve, reject) => {
    const done = () => resolve()
    w.addEventListener('load', () => setTimeout(() => w.print(), 300), { once: true })
    w.addEventListener('error', () => reject(new Error('Print window failed to load')), { once: true })
    void done
  })
}

export default { openPrintTab, printPaper }