import { Component, NgZone, OnInit } from '@angular/core';
import { User } from '../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  user = new User();
  username: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private appService: AppService
  )
  {
    this.mainForm();
    this.getUser();
  }

  get myForm() {
    return this.createForm.controls;
  }

  submitted = false;
  createForm: FormGroup;

  ngOnInit(): void {
  }

  mainForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      gameID: ['', [Validators.required]],
      author: ['', [Validators.required]],
      company: ['', [Validators.required]],
      releaseDate: ['', [Validators.required]],
      instruction: ['', [Validators.required]],
      serieNumber: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    });
    
  }

  onSubmit() {
    this.submitted = true;
    const gameID = this.createForm.get('gameID').value;
   
    if (!this.createForm.valid) {
      alert('Az adatok formátuma nem megfelelő. Kérem töltsön ki minden mezőt!');

      return false;
    }

    this.appService.checkID(gameID).subscribe(
      (isUnique) => {
        if (!isUnique) {
          alert('Kérem, egyedi azonosítót adjon meg!');
          return false;
        } else {
          this.appService.createGame(this.createForm.value).subscribe(
            (res) => {
              alert('Játék hozzáadva');
              this.ngZone.run(() => this.router.navigateByUrl('/list'));
            },
            (error) => {
              alert('Kérem, egyedi azonosítót adjon meg!');
              return false;
            }
          );
        }
      },
      (error) => {
        alert('Hiba: ' + error);
        return false;
      }
    );
  }

  getUser() {
    if (this.appService.getLoggedInUser().uname == null) {
      this.router.navigate(['/login']);
    }

    this.user = this.appService.getLoggedInUser();
    this.username = JSON.stringify(this.user.uname);
  }

  logout(){
    this.user = new User();
    this.appService.setLoggedInUser(this.user);
    this.router.navigate(['/login']);
  }
}
