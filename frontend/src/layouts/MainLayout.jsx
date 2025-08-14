import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <header>
        <Header/>
      </header>
      
      <main className='full-view flex column'>
        <Outlet />
      </main>

      <footer>
        <Footer/>
      </footer>
    </>
  )
}
