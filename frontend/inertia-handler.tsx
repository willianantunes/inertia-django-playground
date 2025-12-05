import Layout from "@/components/Layout.tsx";

const pages: any = import.meta.glob(["./pages/**/*.tsx", "!./pages/**/*.test.tsx", "!./pages/**/*.spec.tsx"], {
  eager: true,
});

const handleCreateInertiaAppResolve = (name: string) => {
  const module = pages[`./pages/${name}.tsx`];
  const page = module.default;
  if (name === "Web/Error") {
    console.warn("Ignoring layout for error page");
  }

  if (page.layout === undefined) {
    page.layout = (page) => <Layout>{page}</Layout>;
  }

  return page;
};

export { handleCreateInertiaAppResolve };
