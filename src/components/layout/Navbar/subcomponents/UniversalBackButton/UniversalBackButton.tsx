import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './UniversalBackButton.css'

interface UniversalBackButtonProps {
  hidden?: boolean
}

export function UniversalBackButton({ hidden }: UniversalBackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/library')
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`universal-back-btn ${hidden ? 'universal-back-btn--hidden' : ''}`}
      aria-label="Go to previous page"
      title="Go back to previous page"
    >
      <span className="universal-back-btn__icon">
        <ArrowLeft size={13} strokeWidth={2.5} />
      </span>
      <span className="universal-back-btn__label">Back</span>
      <span className="universal-back-btn__pulse" aria-hidden />
    </button>
  )
}

export default UniversalBackButton
