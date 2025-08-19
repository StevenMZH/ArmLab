import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export function MobileLayout() {
  return (
    <>
      <header>
        <Header/>
      </header>
      
      <main className='full-view flex column'>
        <Outlet />
      </main>
    </>
  )
}
export default MobileLayout;