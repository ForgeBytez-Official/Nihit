import React from 'react'
import { Maximize2 } from 'lucide-react'
import './DeepFocusMode.css'

interface DeepFocusModeExitTabProps {
  onExit: () => void
}

export const DeepFocusModeExitTab: React.FC<DeepFocusModeExitTabProps> = ({ onExit }) => {
  return (
    <button
      type="button"
      onClick={onExit}
      className="deep-focus-exit-tab"
      title="Exit Deep Focus (ESC)"
      aria-label="Exit Deep Focus Mode and restore full view"
    >
      <span className="deep-focus-exit-tab__icon">
        <Maximize2 size={15} />
      </span>
      <span className="deep-focus-exit-tab__label">Exit Deep Focus</span>
    </button>
  )
}

export default DeepFocusModeExitTab

