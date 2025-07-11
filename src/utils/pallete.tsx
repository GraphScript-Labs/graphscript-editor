import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { Suggestion } from "@defs/UI";

function createPalleteContext() {
  const PalleteContext = createContext<{
    addSuggestion: (suggestion: Suggestion, group: string) => void;
    generateSuggestions: (query: string) => Suggestion[];
  } | undefined>(undefined);

  const PalleteProvider = ({ children }: {
    children: ReactNode;
  }) => {
    const [ keys, setKeys ] = useState<{
      [key: string]: boolean;
    }>({});

    const [suggestions, setSuggestions] = useState<({
      group: string;
    } & Suggestion)[]>([]);

    const addSuggestion = useCallback((
      suggestion: Suggestion,
      group: string = "",
    ) => {
      const suggestionKey = `${suggestion.name}:${group}`;
      if (keys[suggestionKey]) return;
      
      setSuggestions(prev => [
        ...prev,
        {
          ...suggestion,
          group,
        }
      ]);

      setKeys(prev => ({
        ...prev,
        [suggestionKey]: true,
      }));
    }, [keys]);

    const generateSuggestions = useCallback((query: string) => {
      const lowerQuery = query.toLowerCase();
      const filtered = suggestions.filter(
        suggestion => {
          const lowerGroup = suggestion.group.toLowerCase();
          const lowerName = suggestion.name.toLowerCase();
          const searchTerm = `${lowerGroup}: ${lowerName}`;

          return searchTerm.includes(lowerQuery);
        }
      )

      const sorted = filtered.sort((a, b) => {
        const aGroup = a.group.toLowerCase();
        const bGroup = b.group.toLowerCase();

        const aLower = a.name.toLowerCase();
        const bLower = b.name.toLowerCase();

        if (aGroup < bGroup) return -1;
        if (aGroup > bGroup) return 1;

        if (aLower < bLower) return -1;
        if (aLower > bLower) return 1;

        return 0;
      });

      const results = sorted.map(suggestion => ({
        ...suggestion,
        name: `${suggestion.group}: ${suggestion.name}`
      }));

      return results;
    }, [suggestions]);

    const exposed = {
      addSuggestion,
      generateSuggestions,
    };

    return (<>
      <PalleteContext.Provider value={exposed}>
        {children}
      </PalleteContext.Provider>
    </>);
  }

  const usePalleteContext = () => {
    return useContext(PalleteContext);
  }

  return {
    PalleteProvider,
    usePalleteContext
  }
}

export const {
  PalleteProvider,
  usePalleteContext
} = createPalleteContext();

