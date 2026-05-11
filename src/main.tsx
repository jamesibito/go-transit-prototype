import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CaseStudyAssets from './CaseStudyAssets.tsx'
import ExportScreens from './ExportScreens.tsx'

const params = new URLSearchParams(window.location.search)
const isShowcase = params.has('showcase')
const isExport = params.has('export')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isExport ? <ExportScreens /> : isShowcase ? <CaseStudyAssets /> : <App />}
  </StrictMode>,
)
