import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
  X,
} from 'lucide-react'
import type { ToastItem, ToastUrgency } from './toastTypes'
import { ToastContext } from './useToast'
import './Toast.css'

const DEFAULT_DURATION = 3200

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    const activeTimer = timersRef.current.get(id)
    if (activeTimer) {
      clearTimeout(activeTimer)
      timersRef.current.delete(id)
    }
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback(
    (toastInput: Omit<ToastItem, 'id'> | string): string => {
      const parsed: Omit<ToastItem, 'id'> =
        typeof toastInput === 'string'
          ? { title: toastInput, urgency: 'info', durationMs: DEFAULT_DURATION }
          : { urgency: 'info', durationMs: DEFAULT_DURATION, ...toastInput }

      // Deduplicate: If an identical message was triggered in quick succession, ignore it
      let existingId: string | null = null
      setToasts(prev => {
        const duplicate = prev.find(
          t => t.title === parsed.title && (t.message || '') === (parsed.message || '')
        )
        if (duplicate) {
          existingId = duplicate.id
          return prev
        }
        return prev
      })

      if (existingId) {
        return existingId
      }

      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastItem = { id, ...parsed }

      setToasts(prev => {
        const filtered = prev.filter(
          t => !(t.title === newToast.title && (t.message || '') === (newToast.message || ''))
        )
        return [...filtered.slice(-2), newToast] // Keep at most 3 active toasts
      })

      const timer = setTimeout(() => {
        removeToast(id)
      }, newToast.durationMs ?? DEFAULT_DURATION)

      timersRef.current.set(id, timer)

      return id
    },
    [removeToast]
  )

  const clearAll = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current.clear()
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

// Icon helper by urgency
const renderUrgencyIcon = (urgency: ToastUrgency) => {
  switch (urgency) {
    case 'success':
      return <CheckCircle2 size={16} className="toast__icon toast__icon--success" />
    case 'warning':
      return <AlertTriangle size={16} className="toast__icon toast__icon--warning" />
    case 'urgent':
      return <AlertCircle size={16} className="toast__icon toast__icon--urgent" />
    case 'mode':
      return <Sparkles size={16} className="toast__icon toast__icon--mode" />
    case 'info':
    default:
      return <Info size={16} className="toast__icon toast__icon--info" />
  }
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const urgency = toast.urgency || 'info'
          const hasSubtitle = Boolean(toast.message)

          return (
            <motion.div
              key={toast.id}
              layout
              /* Spawns from where the searchbar is (center-bottom, negative X offset from viewport right)
                 slides out to bottom-right, stays still, and exits by continuing to slide to the right */
              initial={{
                opacity: 0,
                x: -320, // positioned behind the center-bottom search bar
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                x: 0, // slides out smoothly to bottom-right
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: 220, // slides further out to the right offscreen
                scale: 0.94,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 28,
                mass: 0.8,
              }}
              className={`toast-item toast-item--${urgency} ${
                hasSubtitle ? 'toast-item--expanded' : 'toast-item--compact'
              }`}
            >
              <div className="toast-item__icon-bubble">
                {renderUrgencyIcon(urgency)}
              </div>

              <div className="toast-item__content">
                <span className="toast-item__title">{toast.title}</span>
                {hasSubtitle && (
                  <span className="toast-item__message">{toast.message}</span>
                )}
              </div>

              <button
                type="button"
                className="toast-item__close"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
