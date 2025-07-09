import { useCallback } from "react";
import {
  closeWindow,
  toggleWindowFullscreen,
} from "@utils/desktopTools";

import "./style.css";

export function WindowActions() {
  const handleClose = useCallback(() => {
    closeWindow();
  }, []);

  const handleMaximize = useCallback(async () => {
    toggleWindowFullscreen();
  }, []);
  
  return (<>
    <div className="root-window-actions">
      <button
        className="root-window-actions-button"
        data-action="close"
        onClick={handleClose}
      />
      <button
        className="root-window-actions-button"
        data-action="minimize"
        disabled
      />
      <button
        className="root-window-actions-button"
        data-action="maximize"
        onClick={handleMaximize}
      />
    </div>
  </>);
}
