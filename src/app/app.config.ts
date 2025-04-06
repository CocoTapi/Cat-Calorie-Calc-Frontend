import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnlyTouchedErrorStateMatcher } from './utils/only-touched-error-state-matcher';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    // Use our custom ErrorStateMatcher globally
    { provide: ErrorStateMatcher, useClass: OnlyTouchedErrorStateMatcher }
  ],
};
