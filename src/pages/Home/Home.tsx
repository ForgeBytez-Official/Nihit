import HomeHero from '../../containers/home_hero/HomeHero'
import HomeFeatured from '../../containers/home_featured/HomeFeatured'
import HomeFeatures from '../../containers/home_features/HomeFeatures'
import HomeInstitutions from '../../containers/home_institutions/HomeInstitutions'
import './Home.css'

export default function Home() {
  return (
    <main className="page-home">
      <HomeHero />
      <HomeFeatured />
      <HomeFeatures />
      <HomeInstitutions />
    </main>
  )
}
