import "@testing-library/jest-dom";

// Some libs check for matchMedia; provide a basic mock
if (!("matchMedia" in window)) {
  // @ts-ignore
  window.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
