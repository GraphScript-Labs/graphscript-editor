import type { PyWebview } from "@defs/PyWebview";

const setupDesktopTools = () => {
  const getApi = (): PyWebview["api"] | undefined => {
    return window.pywebview?.api;
  };

  const checkApiState = (): boolean => {
    return !!Object.keys(getApi() || {}).length;
  };

  const isDesktop = (): boolean => {
    return !!window.hasPWV;
  }

  const waitForPWV = (): Promise<void> => {
    return (new Promise((resolve) => {
      if (!isDesktop() || checkApiState()) {
        resolve();
        return;
      }

      const checkInterval = setInterval(() => {
        if (checkApiState()) {
          resolve();
          clearInterval(checkInterval);
        }
      }, 10);
    }));
  }

  const closeWindow = async () => {
    return getApi()?.close();
  }

  const toggleWindowFullscreen = async () => {
    return getApi()?.toggle_fullscreen();
  }

  const saveFile = async (
    content: string,
    saveName: string,
    fileTypes?: string[],
  ) => {
    if (isDesktop())
      return getApi()!.save_file(content, saveName, fileTypes);
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = saveName;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  const loadFile = async (): Promise<string | null> => {
    if (isDesktop())
      return getApi()!.load_file() || null;
    
    const promise = new Promise<string | null>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return null;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        }

        reader.onerror = () => {
          resolve(null);
        }
        
        reader.readAsText(file);
      };
      
      input.style.display = "none";
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });

    return promise;
  }

  const loadProjectId = async (): Promise<string | null> => {
    if (!isDesktop()) return null;
    await waitForPWV();
    return (await getApi()!.load_project_id()) || null;
  }

  const backupProject = async (content: string): Promise<boolean> => {
    if (!isDesktop()) return false;
    await waitForPWV();
    return getApi()!.backup_project(content);
  }

  const getRestoredProject = async (): Promise<string> => {
    if (!isDesktop()) return "";
    await waitForPWV();
    return getApi()!.restore_project();
  }

  const runProject = async (script: string): Promise<void> => {
    if (!isDesktop()) return;
    await waitForPWV();
    return getApi()!.run_project(script);
  }

  return {
    isDesktop,
    closeWindow,
    toggleWindowFullscreen,
    saveFile,
    loadFile,
    loadProjectId,
    backupProject,
    getRestoredProject,
    runProject,
  }
};

export const {
  isDesktop,
  closeWindow,
  toggleWindowFullscreen,
  saveFile,
  loadFile,
  loadProjectId,
  backupProject,
  getRestoredProject,
  runProject,
} = setupDesktopTools();

