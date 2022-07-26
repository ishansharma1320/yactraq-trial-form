import { Component, OnInit } from '@angular/core';

import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AppService]
})
export class RegisterComponent implements OnInit {
  message: string;
  link: string;
  registerForm = new UntypedFormGroup({
    username: new UntypedFormControl('', Validators.required),
    email:  new UntypedFormControl('', [Validators.required,Validators.email]),
    password: new UntypedFormControl('',Validators.required), 
  });
  constructor(private appService: AppService, public router: Router) { }

  ngOnInit():void {}
  private _createFormData(): FormData{
    const formData = new FormData();
    Object.keys( this.registerForm.controls).forEach(key => {
      formData.append(key, this.registerForm.get(key).value);
   });
    return formData;
  }
  submit(): void{
    if (!this.registerForm.valid) {
      return;
    }
    
    const formData = this._createFormData();
    formData.forEach((val,key)=>{
      console.log(key,val);
    })
    this.appService.postRegistrationFormData(formData).subscribe((success)=>{
      console.log(success);
      console.log(success.target);
      switch (success.target){
        case '/login':
          this.router.navigate(['login']);
          break;
      }

    },(fail)=>{
      console.log(fail);
      switch(fail.error.target){
        case 'user_already_exists':
          this.message = "Seems Like User already exists, Please Login";
          this.link = "https://dev.ishans.dev/login";
          break;
        case 'not_internal':
          this.message = "Register functionality is only available for internal organisation purposes only."
          this.link = "https://yactraq.com";
          break;
      }
    })
  }
}

