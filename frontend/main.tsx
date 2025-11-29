import 'vite/modulepreload-polyfill'

import { InertiaProgress } from '@inertiajs/progress'
import { createInertiaApp } from '@inertiajs/react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'

import '@/styles/main.css'

import Layout from './components/Layout'

// Exclude test files from Vite's page auto-imports to avoid loading them in dev
const pages: any = import.meta.glob([
  './pages/**/*.tsx',
  '!./pages/**/*.test.tsx',
  '!./pages/**/*.spec.tsx',
], { eager: true })

document.addEventListener('DOMContentLoaded', async () => {
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFToken'

  InertiaProgress.init({ showSpinner: true })

  await createInertiaApp({
    resolve: (name) => {
      const module = pages[`./pages/${name}.tsx`]
      const page = module.default
      if (name === 'Web/Error') {
        console.warn('Ignoring layout for error page')
      }

      if (page.layout === undefined) {
        page.layout = (page) => <Layout children={page} />
      }

      return page
    },
    setup({ el, App, props }: any) {
      createRoot(el).render(<App {...props} />)
    },
  })
})
