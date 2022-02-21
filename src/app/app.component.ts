import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service';
interface Language {
  value: string;
  viewValue: string;
}
interface Plan {
  value: string;
  viewValue: string;
}
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
  responseSuccess: Boolean = false;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  langList: Language[] = [
    {value: 'ENGLISH', viewValue: 'English'},
    {value: 'HINDI', viewValue: 'Hindi'},
    {value: 'SPANISH', viewValue: 'Spanish'},
  ];
  plansList: Plan[] =[
    {value: 'PL-1', viewValue: 'Basic'},
    {value: 'PL-2', viewValue: 'Intermediate'},
    {value: 'PL-3', viewValue: 'Advanced'},
  ]
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.trialForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email:  new FormControl('', Validators.required),
      lang: new FormControl('',Validators.required),
      plans:  new FormControl('',Validators.required),
      fileSource: new FormControl('', [Validators.required])
      
    })
    
  }
  goBackToForm(){
    this.formSubmitted = false;
  }
  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.trialForm.get('fileSource').setValue(file);
      console.log(this.trialForm.get('fileSource').value);
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
  
  async submit() {
    if (!this.trialForm.valid) {
      return;
    }
    
    const formData = this.createFormData();
    //API CALL STARTS
    formData.forEach((val,key)=>{
      console.log(key,val);
    })
    this.appService.postFormData(formData).subscribe((success)=>{
      this.responseSuccess = true;
    },(failure)=>{
      this.responseSuccess = false;
    });
    this.formSubmitted = true;
    
    this.reset();
  }
  
  title = 'yactraq-transcripts-trial';
}
