import { Component, OnInit,ViewChild,ElementRef, AfterViewInit } from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppService } from '../app.service';
import { Plan } from '../models/plans.model';
import { Language } from '../models/languages.model';
import { Router } from '@angular/router';



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
  trialForm: FormGroup;
  
  constructor(private appService: AppService,public router: Router, public formBuilder: FormBuilder) { 
    this.trialForm = this.formBuilder.group({
      account_id: ['', Validators.required],
      lang: ['', Validators.required],
      plans:  ['', Validators.required],
      fileSource: this.formBuilder.array([])
      
    });
  }



  get fileSource(): FormArray {
    console.log(this.trialForm);
    return this.trialForm.get('fileSource') as FormArray;
  };
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
      let files = event.target.files;
      for(let file of files){
        let reader = new FileReader();
        console.log(file.size);
        reader.onload = (e: any) => {
          // console.log('e.target.result', e.target.result);
          // console.log(typeof(e.target.result));
          const blob = new Blob([new Uint8Array(e.target.result)], {
            type: file.type,
          });
          this.fileSource.push(this.createItem({file,blob}));
        };
        reader.readAsArrayBuffer(file);
      }
      
    }
  }

  createItem(data: any): FormGroup {
    console.log(this.trialForm);
    return this.formBuilder.group(data);
  }
  private _reset(): void {
    this.trialForm.reset();
    Object.keys(this.trialForm.controls).forEach(key => {
      this.trialForm.get(key).setErrors(null) ;
    });
    this.fileInputVariable.nativeElement.value="";
    this.fileSource.reset();
  }
  private _createFormData(): FormData{
    const formData = new FormData();
    console.log(this.fileSource);
    Object.keys(this.trialForm.controls).forEach(key => {
        if(key === 'fileSource'){
          this.trialForm.get(key).value.forEach((item: any)=>{
            if(item.blob && item.file){
              formData .append(key, item.blob,item.file.name);
            }
          }) 
        }
        else{
          formData.append(key, this.trialForm.get(key).value);
        }
   });
    return formData;
  }
  
submit(): void {
  
  if (!this.trialForm.valid) {
    const invalid = [];
    const controls = this.trialForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log('invalid')
    console.log(invalid);
    return;
    }
    
    const formData = this._createFormData();
    //API CALL STARTS
    console.log(formData);
    formData.forEach((val,key)=>{
      console.log(key,val,typeof(val));
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
    
    
    this._reset();
  }
  
  title = 'yactraq-transcripts-trial';
}
