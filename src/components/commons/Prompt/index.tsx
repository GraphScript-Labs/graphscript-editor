import { useCallback, useRef } from "react";

import { usePromptContext } from "@utils/prompt";

import { DynamicIcon } from "@components/commons/DynamicIcon";
import { Input } from "@components/commons/Input";
import { Glass } from "@components/commons/Glass";

import "./style.css";

export function Prompt() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    promptActive,
    promptMessage,
    promptFnRef,
    cancelPrompt,
  } = usePromptContext()!;

  const handleResponse = useCallback(() => {
    if (!inputRef.current) return;

    const inputValue = inputRef.current.value.trim() || "";
    if (!inputValue) return;

    promptFnRef.current(inputValue);
    inputRef.current.value = "";
  }, [promptFnRef]);

  const cancelResponse = useCallback(() => {
    if (!inputRef.current) return;

    inputRef.current.value = "";
    cancelPrompt();
  }, [cancelPrompt]);

  return (<>
    <div className={[
      "prompt-wrapper",
      promptActive ? "active" : "",
      ].join(" ")}>
      <Glass className="prompt-main">
        <div className="prompt-message">
          {promptMessage}
        </div>

        <div className="prompt-input">
          <Input ref={inputRef} />
          <div
            className="prompt-button"
            onClick={handleResponse}
          >
            <DynamicIcon icon="CircleCheck" />
          </div>
          <div
            className="prompt-button"
            onClick={cancelResponse}
          >
            <DynamicIcon icon="CircleX" />
          </div>
        </div>
      </Glass>
    </div>
  </>);
}

