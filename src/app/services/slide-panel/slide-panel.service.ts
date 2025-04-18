import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlidePanelService {
  private panels = new Map<string, { openPanel: () => void; closePanel: () => void }>();
  private onCloseCallbacks = new Map<string, () => void>();

  private canCloseCallbacks = new Map<string, () => boolean>();
  
  // New event stream for validation triggers
  private validationTriggers = new Map<string, Subject<void>>();

  // Open a specific panel
  open(id: string) {
    this.panels.get(id)?.openPanel();
  }

  // When you want to prevent the panel closing, send false in the callback within ngAfterViewInit()
  canClose(id: string, callback: () => boolean) {
    this.canCloseCallbacks.set(id, callback);
    
    // Create a validation trigger subject if it doesn't exist
    if (!this.validationTriggers.has(id)) {
      this.validationTriggers.set(id, new Subject<void>());
    }
  }

  // Get the validation trigger subject for a panel
  getValidationTrigger(id: string): Subject<void> {
    if (!this.validationTriggers.has(id)) {
      this.validationTriggers.set(id, new Subject<void>());
    }
    return this.validationTriggers.get(id)!;
  }

  // close a specific panel
  close(id: string) {
    const canCloseCallback = this.canCloseCallbacks.get(id);
    
    // If canClose callback exist && the callback returns false, do not close  
    if (canCloseCallback && !canCloseCallback()) {
      // Panel should stay open
      this.panels.get(id)?.openPanel(); // restore position
      
      // Trigger validation to show errors
      this.validationTriggers.get(id)?.next();
      return;
    }

    this.panels.get(id)?.closePanel();
  }

  // When you want to detect the panel has been closed and do something. 
  onClose(id: string, callback: () => void) {
    this.onCloseCallbacks.set(id, callback);
  }




  // ----- These are for slide-panel.component.ts -----

   // Register a panel with a unique ID
   register(id: string, panel: { openPanel: () => void; closePanel: () => void }) {
    this.panels.set(id, panel);
  }

  // Unregister when component is destroyed
  unregister(id: string) {
    this.panels.delete(id);
    this.onCloseCallbacks.delete(id);
    
    // Clean up validation trigger
    const validationTrigger = this.validationTriggers.get(id);
    if (validationTrigger) {
      validationTrigger.complete();
      this.validationTriggers.delete(id);
    }
  }

  // Notify when a panel is closed
  notifyClose(id: string) {
    this.onCloseCallbacks.get(id)?.();
  }
}
