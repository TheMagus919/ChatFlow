import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';

import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,

    /*provideZoneChangeDetection({
      eventCoalescing: true
    })*/
  ]
}).catch(err => console.error(err));