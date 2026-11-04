import React from 'react'
import { Eye } from 'lucide-react'
import './FocusMode.css'

interface FocusModeExitTabProps {
  onExit: () => void
}

export const FocusModeExitTab: React.FC<FocusModeExitTabProps> = ({ onExit }) => {
  return (
    <button
      type="button"
      onClick={onExit}
      className="focus-mode-exit-tab"
      title="Exit Focus Mode (restore sidebar)"
      aria-label="Exit Focus Mode and restore sidebar"
    >
      <span className="focus-mode-exit-tab__icon">
        <Eye size={15} />
      </span>
      <span className="focus-mode-exit-tab__label">Exit Focus</span>
    </button>
  )
}

export default FocusModeExitTab

