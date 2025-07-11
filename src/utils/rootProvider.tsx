import type { JSX, ReactNode } from "react";

import { PromptProvider } from "@utils/prompt";
import { PalleteProvider } from "@utils/pallete";
import { VariablesProvider } from "@utils/variables";
import { NodeSystemProvider } from "@utils/nodeSystem";
import { NodeHistoryProvider } from "@utils/nodeHistory";
import { NodeFactoryProvider } from "@utils/nodeFactory";
import { AppDataProvider } from "@utils/appData";

type ProviderType = ({ children }: {
  children: ReactNode;
}) => JSX.Element;

export function RootProvider({ children }: {
  children: ReactNode;
}) {
  const providers: ProviderType[] = [
    PromptProvider,
    PalleteProvider,
    VariablesProvider,
    NodeSystemProvider,
    NodeHistoryProvider,
    NodeFactoryProvider,
    AppDataProvider,
  ];

  return providers.reduceRight((acc, Provider) => {
    return (<>
      <Provider>
        {acc}
      </Provider>
    </>);
  }, children);
}

