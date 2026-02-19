import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  loadStyles(urls: string[]) {
    urls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.id = this.extractIdFromUrl(url); // Unique ID for each stylesheet
      document.head.appendChild(link);
    });
  }

  removeStyles(urls: string[]) {
    urls.forEach((url) => {
      const elementId = this.extractIdFromUrl(url);
      const existingElement = document.getElementById(elementId);
      if (existingElement) {
        existingElement.remove();
      }
    });
  }

  loadScripts(urls: string[]) {
    urls.forEach((url) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;
      script.id = this.extractIdFromUrl(url); // Unique ID for each script
      document.body.appendChild(script);
    });
  }

  removeScripts(urls: string[]) {
    urls.forEach((url) => {
      const elementId = this.extractIdFromUrl(url);
      const existingElement = document.getElementById(elementId);
      if (existingElement) {
        existingElement.remove();
      }
    });
  }

  private extractIdFromUrl(url: string): string {
    return url.split('/').pop()?.split('.').shift() || '';
  }
}
