import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ApiContext from "./context/ApiContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ApiContext>
    <App />
  </ApiContext>
);
