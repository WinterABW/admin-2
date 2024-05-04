import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent implements OnInit{
  user: any;
  isLoggin: boolean;

  constructor(private authService: AuthService){
    
  }

  logout() {
    this.authService.logout()
  }

  ngOnInit() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.user = res;
        this.isLoggin = this.authService.isLoggedIn();
      } else {
        this.authService.getUserData().subscribe(
          (response: any) => {
            this.authService.setUserData(response);
          }
        );
      }
    });
    

  }
}

