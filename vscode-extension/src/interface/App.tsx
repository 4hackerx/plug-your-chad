import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="w-min p-5">
        <div className="flex flex-col gap-4">Plug Your Chad</div>
      </div>
    </ThemeProvider>
  );
}

export default App;
