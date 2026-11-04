import React from 'react'
import './MainAbstractContainer.css'

interface MainAbstractContainerProps {
  abstract: string
}

export const MainAbstractContainer: React.FC<MainAbstractContainerProps> = ({ abstract }) => {
  return (
    <section id="section-abstract" data-section-id="section-abstract" className="main-abstract-area">
      <div className="main-abstract-heading">
        <h2 className="main-abstract-title">Abstract</h2>
        <span className="main-abstract-rule" aria-hidden />
      </div>
      <div className="main-abstract-prose">
        <p className="main-abstract-lead">{abstract}</p>
      </div>
    </section>
  )
}
