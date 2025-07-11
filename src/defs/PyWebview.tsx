export interface PyWebview {
  api: {
    close: () => Promise<void>;
    toggle_fullscreen: () => Promise<void>;
    save_file: (
      content: string,
      save_name: string,
      file_types?: string[],
    ) => Promise<void>;
    load_file: () => Promise<string>;
    load_project_id: () => Promise<string | null>;
  }
}

