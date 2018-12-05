import { ErrorHandler, Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // private errorLogApi = '/api/logerror'; // API to post errors too

  constructor(private settings: AppSettings) {}

  // Custom error handler for application/angular errors
  // Uses plain JS to eliminate any dependencies that may not be available due to the error
  public handleError(error: any) {
    console.error(error);
    // Only throw application errors to the dom. If the error has an errorMsg then it is an internal error
    if (this.settings.isBrowser && !error.errorMsg) {
    }
    // Now throw the error to the console
    throw error;
  } // end handleError

  /**
   * Log the error to an API
  private logError(errorMsg: string) {
    const http = new XMLHttpRequest();
    const params = 'NEEDKEY=' + errorMsg;
    http.open('POST', this.errorLogApi, true);

    // Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = () => { // Call a function when the state changes.
      if (http.readyState === 4 && http.status === 200) {
        console.warn('Successfully logged error');
      }
    };
    http.send(params);
  } // end logError
  */
}
