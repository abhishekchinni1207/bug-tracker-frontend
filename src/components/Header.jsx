import Breadcrumbs from './Breadcrumbs'
import ProjectSelector from './ProjectSelector'

const Header = () => {
  return (
    <header className="h-14 border-b border-slate-700 px-6 flex items-center justify-between">
      <Breadcrumbs />
      <ProjectSelector />
    </header>
  )
}

export default Header
