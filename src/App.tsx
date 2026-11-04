import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout/Layout'
import { ToastProvider } from './components/ui/Toast'

// Full react-router-dom routing. Each page is a folder with its own sections;
// sections can be linked to via URL fragments for auto-scroll later.
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </BrowserRouter>
  )
}