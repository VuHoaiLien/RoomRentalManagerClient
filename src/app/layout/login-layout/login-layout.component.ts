import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  imports: [ RouterOutlet],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css'],
  standalone: true,
})
export class LoginLayoutComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Initialize any data or services needed for the login component
  }

  onLogin(): void {
    // Handle login logic here
  }

}
