import "vite/modulepreload-polyfill";

import { InertiaProgress } from "@inertiajs/progress";
import { createInertiaApp } from "@inertiajs/react";
import axios from "axios";
import { createRoot } from "react-dom/client";

import { handleCreateInertiaAppResolve } from "@/inertia-handler.tsx";

document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFToken";
  InertiaProgress.init({ showSpinner: true });

  await createInertiaApp({
    resolve: handleCreateInertiaAppResolve,
    setup({ el, App, props }: any) {
      createRoot(el).render(<App {...props} />);
    },
  });
});
