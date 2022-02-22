import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { Plan } from './models/plans.model';
import { Language } from './models/languages.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})
export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInputVariable: ElementRef;
  formSubmitted: Boolean = false;
  trialForm: FormGroup;
  notAuthorised: Boolean;
  message: String;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  langList: Language[] = [];
  plansList: Plan[] = [];
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.getLanguages().subscribe(success=>{
      success.response.map((item)=>{
        // console.log(item);
        this.langList.push({value: item.value, viewValue: item.viewValue })
      })
    },failure=>{
      this.langList = [];
    });
    this.appService.getPlans().subscribe(success=>{
      success.response.map((item)=>{
        // console.log(item);
        this.plansList.push({value: item.value, viewValue: item.viewValue })
      })
    },failure=>{
      this.plansList = [];
    })
    this.trialForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email:  new FormControl('', [Validators.required,Validators.email]),
      lang: new FormControl('',Validators.required),
      plans:  new FormControl('',Validators.required),
      fileSource: new FormControl('', [Validators.required])
      
    })
    
  }
  goBackToForm(){
    this.formSubmitted = false;
    this.notAuthorised = undefined;
  }
  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.trialForm.get('fileSource').setValue(file);
      // console.log(this.trialForm.get('fileSource').value);
    }
  }
  private reset(){
    this.trialForm.reset();
    Object.keys(this.trialForm.controls).forEach(key => {
      this.trialForm.get(key).setErrors(null) ;
    });
    this.fileInputVariable.nativeElement.value="";
  }
  private createFormData(){
    const formData = new FormData();
    Object.keys( this.trialForm.controls).forEach(key => {
      formData.append(key, this.trialForm.get(key).value);
   });
    return formData;
  }
  
submit() {
    if (!this.trialForm.valid) {
      return;
    }
    
    const formData = this.createFormData();
    //API CALL STARTS
    formData.forEach((val,key)=>{
      console.log(key,val);
    })
    this.appService.postFormData(formData).subscribe((success)=>{
      this.formSubmitted = true;
      
    },(failure)=>{
      this.formSubmitted = false;
      if(failure.status === 403){
        this.notAuthorised = true;
        this.message = failure.error.message;
      }
    });
    
    
    this.reset();
  }
  
  title = 'yactraq-transcripts-trial';
}
