export type ToastUrgency = 'info' | 'success' | 'warning' | 'urgent' | 'mode'

export interface ToastItem {
  id: string
  title: string
  message?: string
  urgency?: ToastUrgency
  durationMs?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'> | string) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

