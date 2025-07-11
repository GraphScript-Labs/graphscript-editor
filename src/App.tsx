import { useAppDataContext } from "@utils/appData";

import { AppWindow } from "@components/window/AppWindow";
import { Canvas } from "@components/engine/Canvas";
import { Prompt } from "@components/commons/Prompt";

export default function App() {
  const {
    windowTools,
    breadcrumb,
    generateSuggestions,
    nodes,
  } = useAppDataContext()!;

  return (<>
    <AppWindow
      tools={windowTools}
      breadcrumb={breadcrumb}
      generateSuggestions={generateSuggestions}
    >
      <Canvas nodes={nodes} />
      <Prompt />
    </AppWindow>
  </>);
}

