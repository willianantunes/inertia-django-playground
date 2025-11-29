import React from "react";

export const Form: React.FC<
  React.PropsWithChildren<{
    action?: string;
    method?: string;
    resetOnSuccess?: boolean;
    setDefaultsOnSuccess?: boolean;
    onSubmit?: React.FormEventHandler;
  }>
> = ({ children, onSubmit, action, method }) => {
  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };
  const child = typeof children === "function" ? (children as any)({ processing: false, errors: {} as any }) : children;
  return (
    <form onSubmit={handleSubmit} action={action} method={method}>
      {child}
    </form>
  );
};

type InertiaLinkProps = React.PropsWithChildren<{
  href?: string;
  method?: string;
  [k: string]: any;
}>;

const pickAnchorProps = (props: Record<string, any>) => {
  const { ...rest } = props;
  // Whitelist of common anchor/button props used in our app/tests
  const allowed = [
    "href",
    "target",
    "rel",
    "id",
    "className",
    "style",
    "title",
    "aria-label",
    "onClick",
    "children",
  ] as const;
  const out: Record<string, any> = {};
  for (const key of allowed) {
    if (key in rest) out[key] = (rest as any)[key];
  }
  return out;
};

export const Link = React.forwardRef<HTMLAnchorElement, InertiaLinkProps>(({ children, href = "#", ...rest }, ref) => {
  const domProps = pickAnchorProps(rest as any);
  return (
    <a ref={ref} href={href} {...domProps}>
      {children}
    </a>
  );
});
Link.displayName = "InertiaLinkMock";

let pageProps: any = { props: {} };
export const __setPageProps = (props: any) => {
  pageProps = { props };
};

export const usePage = <T = any>(): { props: T } => {
  return pageProps as { props: T };
};

export const router = {
  visit: () => {},
  get: () => {},
  post: () => {},
};

export default {};
