import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"

const createPromptContext = () => {
  const PromptContext = createContext<{
    promptActive: boolean,
    promptMessage: string,
    promptFnRef: RefObject<(data: string) => void>,
    requestPrompt: (msg: string) => Promise<string | null>,
    cancelPrompt: () => void,
  } | undefined>(undefined);

  const PromptProvider = ({ children }: {
    children: ReactNode
  }) => {
    const [promptActive, setPromptActive] = useState<boolean>(false);
    const [promptMessage, setPromptMessage] = useState<string>("");
    const promptFnRef = useRef<(data: string) => void>(() => {});
    const requestPrompt = useCallback((msg: string) => {
      setPromptActive(true);
      setPromptMessage(msg);

      return new Promise<string | null>((resolve) => {
        promptFnRef.current = (data: string) => {
          setPromptActive(false);
          resolve(data);
        };
      });
    }, []);

    const cancelPrompt = useCallback(() => {
      setPromptActive(false);
      setPromptMessage("");
      promptFnRef.current = () => {};
    }, []);

    const exposed = {
      promptActive,
      promptMessage,
      promptFnRef,
      requestPrompt,
      cancelPrompt,
    };

    return (
      <PromptContext.Provider value={exposed}>
        {children}
      </PromptContext.Provider>
    );
  };

  const usePromptContext = () => {
    return useContext(PromptContext);
  };

  return {
    PromptProvider,
    usePromptContext,
  }
}

export const {
  PromptProvider,
  usePromptContext,
} = createPromptContext();

