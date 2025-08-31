import 'vite/modulepreload-polyfill'
import { InertiaProgress } from '@inertiajs/progress'
import axios from 'axios'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import Layout from './components/Layout'

import '../css/main.css'

const pages = import.meta.glob('./pages/**/*.jsx')

document.addEventListener('DOMContentLoaded', () => {
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFToken'

  InertiaProgress.init({ showSpinner: true })

  createInertiaApp({
    resolve: async (name) => {
      const page = (await pages[`./pages/${name}.jsx`]()).default
      page.layout = page.layout || Layout
      return page
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />)
    },
  })
})
