import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnlyTouchedErrorStateMatcher } from './utils/only-touched-error-state-matcher';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { CommonConstants } from './app.constants';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";

export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    CommonConstants.LANGUAGE_FILE_PATH,
    CommonConstants.LANGUAGE_FILE_EXTENSION
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    // Use our custom ErrorStateMatcher globally
    { 
      provide: ErrorStateMatcher, 
      useClass: OnlyTouchedErrorStateMatcher 
    },
    provideHttpClient(),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
    })])
  ]
};
