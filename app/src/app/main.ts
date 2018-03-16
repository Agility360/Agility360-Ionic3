import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';
import { DEBUG_MODE } from '../shared/constants';

if (!DEBUG_MODE) enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
