import { Component, OnInit,Output,EventEmitter} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AppService]
})
export class LoginComponent implements OnInit {
  message: string;
  link: string;
  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('',Validators.required), 
  });
  // @Output() isLoggedIn: EventEmitter<any> = new EventEmitter();
  constructor(private appService: AppService, public router: Router) { }

  ngOnInit():void {}
  private _createFormData(): FormData{
    const formData = new FormData();
    Object.keys( this.loginForm.controls).forEach(key => {
      formData.append(key, this.loginForm.get(key).value);
   });
    return formData;
  }
  submit(): void{
    if (!this.loginForm.valid) {
      return;
    }
    
    const formData = this._createFormData();
    formData.forEach((val,key)=>{
      console.log(key,val);
    })
    this.appService.postLoginFormData(formData).subscribe((success)=>{
      console.log(success);
      switch (success.target){
        case '/transcripts':
          // this.isLoggedIn.emit(true);
          this.router.navigate(['transcripts']);
          break;
      }
    },(fail)=>{
      switch(fail.error.target){
        case 'no_user_exists':
          this.message = "No User Exists for the provided username and password combination. Please Register";
          this.link = "https://dev.ishans.dev/register";
          break;
        case 'wrong_password':
          this.message = "Entered Password is Incorrect";
          this.link = undefined;
          break;
      }
    })
  }
}

