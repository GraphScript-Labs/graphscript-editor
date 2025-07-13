import type { PyWebview } from "@defs/PyWebview";

const setupDesktopTools = () => {
  const pwv: PyWebview | undefined = window.pywebview;

  const isDesktop = (): boolean => {
    return document.body.getAttribute("data-pywebview-id") !== null;
  }

  const waitForPWV = (): Promise<void> => {
    return (new Promise((resolve) => {
      if (!isDesktop()) {
        resolve();
        return;
      }

      if (Object.keys(pwv?.api || {}).length) {
        resolve();
        return;
      }

      setTimeout(() => {
        resolve();
      }, 100);
    }));
  }

  const closeWindow = async () => {
    return pwv?.api.close();
  }

  const toggleWindowFullscreen = async () => {
    return pwv?.api.toggle_fullscreen();
  }

  const saveFile = async (
    content: string,
    saveName: string,
    fileTypes?: string[],
  ) => {
    if (isDesktop())
      return pwv!.api.save_file(content, saveName, fileTypes);
    
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
      return pwv!.api.load_file() || null;
    
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
    return (await pwv!.api.load_project_id()) || null;
  }

  return {
    isDesktop,
    closeWindow,
    toggleWindowFullscreen,
    saveFile,
    loadFile,
    loadProjectId,
  }
};

export const {
  isDesktop,
  closeWindow,
  toggleWindowFullscreen,
  saveFile,
  loadFile,
  loadProjectId,
} = setupDesktopTools();

