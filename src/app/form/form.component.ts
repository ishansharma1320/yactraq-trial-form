import { Component, OnInit,ViewChild,ElementRef, AfterViewInit } from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppService } from './form.service';
import { Plan } from '../models/plans.model';
import { Language } from '../models/languages.model';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [AppService]
})
export class FormComponent implements OnInit {
  @ViewChild('fileInput') fileInputVariable: ElementRef;
  formSubmitted: Boolean = false;
  notAuthorised: Boolean;
  message: String;
  langList: Language[] = [];
  plansList: Plan[] = [];
  trialForm = new FormGroup({
    account_id: new FormControl('', Validators.required),
    lang: new FormControl('',Validators.required),
    plans:  new FormControl('',Validators.required),
    fileSource: new FormControl('', [Validators.required])
    
  });
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
    
  }
  
  
  goBackToForm(): void {
    this.formSubmitted = false;
    this.notAuthorised = undefined;
  }
  onFileChange(event): void {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.trialForm.get('fileSource').setValue(file);
      
    }
  }

  private _reset(): void {
    this.trialForm.reset();
    Object.keys(this.trialForm.controls).forEach(key => {
      this.trialForm.get(key).setErrors(null) ;
    });
    this.fileInputVariable.nativeElement.value="";
  }
  private _createFormData(): FormData{
    const formData = new FormData();
    Object.keys( this.trialForm.controls).forEach(key => {
        formData.append(key, this.trialForm.get(key).value);
   });
    return formData;
  }
  
submit(): void {
  
  if (!this.trialForm.valid) {
    // const invalid = [];
    // const controls = this.trialForm.controls;
    // for (const name in controls) {
    //     if (controls[name].invalid) {
    //         invalid.push(name);
    //     }
    // }
    // console.log(invalid);
    return;
    }
    
    const formData = this._createFormData();
    //API CALL STARTS
    formData.forEach((val,key)=>{
      console.log(key,val);
    })
    // this.appService.postFormData(formData).subscribe((success)=>{
    //   this.formSubmitted = true;
      
    // },(failure)=>{
    //   this.formSubmitted = false;
    //   if(failure.status === 403){
    //     this.notAuthorised = true;
    //     this.message = failure.error.message;
    //   }
    // });
    
    
    this._reset();
  }
  
  title = 'yactraq-transcripts-trial';
}
