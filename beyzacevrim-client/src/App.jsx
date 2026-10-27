import { Route, Routes } from 'react-router'
import SiteLayout from './layouts/SiteLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SolutionPage from './pages/SolutionPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="solutions/:slug" element={<SolutionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
