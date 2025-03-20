import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlidePanelService {
  private panels = new Map<string, { openPanel: () => void; closePanel: () => void }>();
  private onCloseCallbacks = new Map<string, () => void>();

  // Register a panel with a unique ID
  register(id: string, panel: { openPanel: () => void; closePanel: () => void }) {
    this.panels.set(id, panel);
  }

  // Unregister when component is destroyed
  unregister(id: string) {
    this.panels.delete(id);
    this.onCloseCallbacks.delete(id);
  }

  // Open a specific panel
  open(id: string) {
    this.panels.get(id)?.openPanel();
  }

  // Close a specific panel
  close(id: string) {
    this.panels.get(id)?.closePanel();
  }

  // Register a close callback for a specific panel
  onClose(id: string, callback: () => void) {
    this.onCloseCallbacks.set(id, callback);
  }

  // Notify when a panel is closed
  notifyClose(id: string) {
    this.onCloseCallbacks.get(id)?.();
  }
}
