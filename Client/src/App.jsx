import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import Design from "./components/my_component/design";

import "./App.css";

import Home from "./Pages/Home/Home";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="app-background">
        <div className="absolute right-4 top-4 z-50">
          <ModeToggle />
        </div>

        <Design />
        <div className="App">
          <Home />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
