import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/lib/components/ui/button";
import { Textarea } from "@/lib/components/ui/textarea";
import React from "react";
import { CombinedAppState } from "src/ui/App";

type CombinedProps = React.HTMLAttributes<HTMLDivElement> &
  CombinedAppState & { updateState: React.Dispatch<Partial<CombinedAppState>> };

const ChatSelectionCombo = ({
  active_question,
  updateState,
  languageId,
  textSelection,
  activeEditorName,
  startLine,
  endLine,
}: CombinedProps) => {
  const markdown = `\`\`\`${languageId}\n${textSelection}\n\`\`\``;

  return (
    <div className="grid w-full gap-2">
      {textSelection && (
        <div className="border border-input overflow-hidden">
          <div className="bg-background flex justify-between">
            <a href={activeEditorName}>{activeEditorName}</a>
            <p>
              Lines {startLine + 1} - {endLine + 1}
            </p>
          </div>
          <div className="bg-background/50 w-full">
            <Markdown
              className="prose prose-code:w-full overflow-x-scroll"
              remarkPlugins={[remarkGfm]}
            >
              {markdown}
            </Markdown>
          </div>
        </div>
      )}

      <Markdown className="prose overflow-x-scroll" remarkPlugins={[remarkGfm]}>
        {active_question}
      </Markdown>

      <Textarea
        onChange={(e) => {
          updateState({
            active_question: e.target.value,
          });
        }}
        placeholder="Type your message here."
      />
      <Button>Send message</Button>
    </div>
  );
};

export default ChatSelectionCombo;
