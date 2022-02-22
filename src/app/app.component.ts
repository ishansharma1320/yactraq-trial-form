import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppService } from './app.service';
import { Plan } from './models/plans.model';
import { Language } from './models/languages.model';
export interface Country {
  countryCode: string;
  countryName: string;
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
  notAuthorised: Boolean;
  message: String;
  langList: Language[] = [];
  plansList: Plan[] = [];
  options: Country[] = [{countryName: 'India', countryCode: '+91'}, {countryName: 'Australia', countryCode: '+61'}, {countryName: 'USA', countryCode: '+1'}];
  filteredCNameOptions: Observable<Country[]>;
  filteredCcodeOptions: Observable<Country[]>;
  trialForm = new FormGroup({
    name: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    ccode: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email:  new FormControl('', [Validators.required,Validators.email]),
    org: new FormControl('', Validators.required),
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
    this.filteredCNameOptions = this.trialForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value === undefined || value === null? '':value.countryName)),
      map(name => (name ? this._filter(name,'country') : this.options.slice())),
    );
    this.filteredCcodeOptions = this.trialForm.controls['ccode'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value === undefined || value === null? '':value.countryCode)),
      map(name => (name ? this._filter(name,'') : this.options.slice())),
    );
    
  }
  cNameDisplayFn(country: Country): string {
    return country && country.countryName ? country.countryName : '';
  }
  cCodeDisplayFn(country: Country): string {
    return country && country.countryName ? country.countryName : '';
  }

  
  goBackToForm(): void {
    this.formSubmitted = false;
    this.notAuthorised = undefined;
  }
  onFileChange(event): void {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.trialForm.get('fileSource').setValue(file);
      // console.log(this.trialForm.get('fileSource').value);
    }
  }
  private _filter(name: string,control: string): Country[] {
    console.log(name);
    const filterValue = name.toLowerCase();
    let res;
    switch(control){
      case 'country':{
        res = this.options.filter(option => option.countryName.toLowerCase().includes(filterValue));
        break;
      }
      default:{
        res = this.options.filter(option => option.countryCode.toLowerCase().includes(filterValue));
      }
      }
    return res;
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
