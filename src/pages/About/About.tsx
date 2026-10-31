import AboutIntro from '../../containers/about_intro/AboutIntro'
import AboutPillars from '../../containers/about_pillars/AboutPillars'
import AboutWorkflow from '../../containers/about_workflow/AboutWorkflow'
import AboutTeam from '../../containers/about_team/AboutTeam'
import './About.css'

export default function About() {
  return (
    <main className="page-about">
      <AboutIntro />
      <AboutPillars />
      <AboutWorkflow />
      <AboutTeam />
    </main>
  )
}
