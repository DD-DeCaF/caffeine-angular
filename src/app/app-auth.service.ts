import {Injectable} from '@angular/core';
import {Location, PopStateEvent} from '@angular/common';

@Injectable()
export class AppAuthService {
  // isRequired = true;
  public trustedURLs = new Set();
  // location: any;
  public currentUrl: string = null;

  constructor(private location: Location) {
    // TODO this should use the observable and expose an observable.
    location.subscribe((popStateEvent: PopStateEvent) => {
      this.currentUrl = popStateEvent.url;
    });
  }

  // getCurrentURL() {
  //   if (this.location._baseHref.startsWith('https://') || this.location._baseHref.startsWith('https://')) {
  //     return this.location.prepareExternalUrl(this.location.path());
  //   }
  //   // TODO - It does not seem like there is a clean way to do this.
  //   return this.location._platformStrategy._platformLocation.location.href;
  // }

  isTrustedURL(url: string): boolean {
    const currentURL = this.currentUrl;
    const currentHostname = (new URL(currentURL)).hostname;

    const urlObj = new URL(url, currentURL);
    return urlObj.hostname === currentHostname || Array.from(this.trustedURLs)
      .some(trustedURL => urlObj.href.startsWith(trustedURL));
  }
}
