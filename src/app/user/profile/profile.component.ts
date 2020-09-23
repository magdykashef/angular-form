import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  id: number;
  userData$: Observable<User>; // hold the user data comming form the user state

  constructor(private userDataService: UserDataService,
              private activatedrouter: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    this.activatedrouter.params // geting the user id from the url
      .subscribe(params => this.id = +params.id);

    this.userData$ = this.userDataService.curruntUser$; // getting the currunt user data form the user state
  }

  onDelete(): void { // deleting user
    this.userDataService.deletUserData(this.id) // deleting user from the database
      .subscribe(
        data => {
          this.userDataService.curruntUserChanges(); // deleting user  from the user state
          this.router.navigateByUrl('/register'); // redirecting to register component
        },
        error => {
          console.log(error);
        });
  }

  onEdit() { // redirecting to edit component
    this.router.navigateByUrl(`profile/${this.id}/edit`);
  }

  onBack() { // redirecting to register component
    this.router.navigateByUrl('/register');
  }
}
