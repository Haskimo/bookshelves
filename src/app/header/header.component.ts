import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;

  constructor(private authService: AuthService) {
    const config = {
      apiKey: "AIzaSyAuDdMqOi9CPW4L96YLtdrSd9WyZV_AMl4",
      authDomain: "http-client-demo-77161.firebaseapp.com",
      databaseURL: "https://http-client-demo-77161.firebaseio.com",
      projectId: "http-client-demo-77161",
      storageBucket: "http-client-demo-77161.appspot.com",
      messagingSenderId: "530045402853"
    };
    firebase.initializeApp(config);
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
  }

  onSignOut() {
    this.authService.signOutUser();
  }

}
