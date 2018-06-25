import { browser, by, element } from 'protractor';
import { promise as wdpromise } from 'selenium-webdriver';

export class AppPage {
  // tslint:disable-next-line:no-any
  public navigateTo(): wdpromise.Promise<any> {
    return browser.get('/');
  }

  public getParagraphText(): wdpromise.Promise<string> {
    return element(by.css('app-root h1')).getText();
  }
}
