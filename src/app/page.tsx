import AppProvider from "@/AppContext";
import App from "./App";

export default function Home() {
  return (
    <div>
      <h1>Chord Tool</h1>
      <AppProvider>
        <App />
      </AppProvider>
    </div>
  );
}
