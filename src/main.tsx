import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";

import { persistor, Store } from "./state/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/index.ts";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={Store}>
        <BrowserRouter>
          <StrictMode>
            <App />
          </StrictMode>
        </BrowserRouter>
      </Provider>
    </PersistGate>
  </QueryClientProvider>
);
