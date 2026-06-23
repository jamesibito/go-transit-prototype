import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CaseStudyAssets from './CaseStudyAssets.tsx'
import ExportScreens from './ExportScreens.tsx'
import ExportAll from './ExportAll.tsx'

const params = new URLSearchParams(window.location.search)
const isShowcase = params.has('showcase')
const isExport = params.has('export')
const isExportAll = params.has('all')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isExportAll ? <ExportAll /> : isExport ? <ExportScreens /> : isShowcase ? <CaseStudyAssets /> : <App />}
  </StrictMode>,
)

// Figma capture helper: when a capture hash is present, scroll the page once so
// any lazily-rendered content paints before the capture fires, then return to top.
if (window.location.hash.includes('figmacapture')) {
  const reveal = async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
    await wait(500)
    const step = Math.round(window.innerHeight * 0.6)
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await wait(80)
    }
    window.scrollTo(0, 0)
  }
  if (document.readyState === 'complete') reveal()
  else window.addEventListener('load', reveal)
}
