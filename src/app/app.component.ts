import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  contructor() {
    var config = {
    apiKey: "AIzaSyAuDdMqOi9CPW4L96YLtdrSd9WyZV_AMl4",
    authDomain: "http-client-demo-77161.firebaseapp.com",
    databaseURL: "https://http-client-demo-77161.firebaseio.com",
    projectId: "http-client-demo-77161",
    storageBucket: "http-client-demo-77161.appspot.com",
    messagingSenderId: "530045402853"
  };
  firebase.initializeApp(config);
  }
}
