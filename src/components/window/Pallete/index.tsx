import { useEffect, useState } from "react";

import type { Suggestion } from "@defs/UI";

import { Input } from "@components/commons/Input";
import { DynamicIcon } from "@components/commons/DynamicIcon";

import "./style.css";

export function Pallete({
  generateSuggestions,
}: {
  generateSuggestions: (query: string) => Suggestion[];
}) {
  const [active, setActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setSuggestions(generateSuggestions(query) || []);
  }, [generateSuggestions, query]);

  return (<>
    <div
      className="app-navigator"
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className={[
        "suggestions",
        active ? "active" : "",
      ].join(" ")}>
        {
          suggestions.map(suggestion => <div
            key={suggestion.name}
            className="suggestion"
            onMouseDown={() => {
              suggestion.action();
              setQuery("");
            }}
          >
            <div className="suggestion-icon">
              <DynamicIcon icon={suggestion.icon} />
            </div>

            <div className="suggestion-name">
              {suggestion.name}
            </div>
          </div>)
        }
      </div>
    </div>
  </>);
}

