import { useEffect, useReducer } from "react";

import ChatSelectionCombo from "@/lib/components/molecules/chat-selection-combo";
import LlamaPartyDrawer from "@/lib/components/molecules/llama-party-drawer";
import { LLMSelect } from "@/lib/components/molecules/llm-select";
import SettingsSheet from "@/lib/components/molecules/settings-sheet";
import { ThemeProvider } from "@/lib/components/theme-provider";
import { SelectionDetails } from "src/shared/interface";
import { vscode } from "./main";

// INSTALL npm install -D @tailwindcss/typography to properly display tables and such in md

interface AppState {
  loading: boolean;
  thread_messages: string[];
  active_question: string;
  active_question_disabled: boolean;
}

export type CombinedAppState = AppState & Omit<SelectionDetails, "command">;

function App() {
  const [state, updateState] = useReducer(
    (
      current: CombinedAppState,
      update: Partial<CombinedAppState>
    ): CombinedAppState => ({
      ...current,
      ...update,
    }),
    {
      loading: false,
      thread_messages: [],
      active_question: "",
      active_question_disabled: false,
      textSelection: "",
      startLine: 0,
      startCharacter: 0,
      endLine: 0,
      endCharacter: 0,
      languageId: "",
      fileName: "",
      file: "",
      activeEditorName: "",
      visibleEditorsName: [],
      activeColorTheme: "",
    }
  );

  useEffect(() => {
    vscode.postMessage({ command: "onReady" });
    return () => {};
  }, []);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case "selectionDetails":
          const selectionDetails: SelectionDetails = message;
          updateState(selectionDetails);
          console.log(selectionDetails);
          break;
      }
    });
    return () => {};
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <LLMSelect />

          <div className="flex gap-4">
            <LlamaPartyDrawer />
            <SettingsSheet />
          </div>
        </div>

        <ChatSelectionCombo updateState={updateState} {...state} />

        {/* <button
          onClick={() => {
            vscode.postMessage({ command: "editDocument" });
          }}
        >
          Believe In Yourself!
        </button> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
