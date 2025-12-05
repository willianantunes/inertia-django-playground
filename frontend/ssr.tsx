import process from "node:process";
import { handleCreateInertiaAppResolve } from "@/inertia-handler.tsx";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";

createServer(
  async (page) =>
    await createInertiaApp({
      page,
      render: ReactDOMServer.renderToString,
      resolve: handleCreateInertiaAppResolve,
        setup: ({ App, props }) => <App {...props} />,
    }),
  { cluster: true, port: parseInt(process.env.NODE_PORT!) || 3000 },
);
