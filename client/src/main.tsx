import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";
import "./index.css";

// Prevent runtime error overlay from network failures
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('fetch') || 
      event.reason?.message?.includes('Failed to fetch')) {
    console.debug('Network error suppressed:', event.reason);
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
