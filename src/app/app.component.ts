import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppService } from './app.service';
import { Plan } from './models/plans.model';
import { Language } from './models/languages.model';
import { Country } from './models/country.model';
import { Industry } from './models/industry.model';


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
  countryInfoOptions: Country[];
  industryOptions: Industry[];
  filteredCNameOptions: Observable<Country[]>;
  filteredCcodeOptions: Observable<Country[]>;
  filteredIndustryOptions: Observable<Industry[]>;
  trialForm = new FormGroup({
    name: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    ccode: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email:  new FormControl('', [Validators.required,Validators.email]),
    org: new FormControl('', Validators.required),
    orgcat: new FormControl('', Validators.required),
    orgpos: new FormControl('', Validators.required),
    lang: new FormControl('',Validators.required),
    plans:  new FormControl('',Validators.required),
    fileSource: new FormControl('', [Validators.required])
    
  });
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.getInitData().subscribe(success=>{
      console.log('success');
      this.countryInfoOptions = success.response.countryInfo;
      this.industryOptions = success.response.industries;
      console.log(this.countryInfoOptions);
    },failure=>{
      this.countryInfoOptions = [];
      this.industryOptions = [];
    })
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
      map(value => (typeof value === 'string' ? value : value === undefined || value === null? '':value.name)),
      map(name => (name ? this._filter(name,'country') : this.countryInfoOptions.slice())),
    );
    this.filteredCcodeOptions = this.trialForm.controls['ccode'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value === undefined || value === null? '':value.dial_code)),
      map(name => (name ? this._filter(name,'ccode') : this.countryInfoOptions.slice())),
    );
    this.filteredIndustryOptions= this.trialForm.controls['orgcat'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value === undefined || value === null? '':value.name)),
      map(name => (name ? this._filter(name,'industry') : this.industryOptions.slice())),
    );
  }
  cNameDisplayFn(country: Country): string {
    return country && country.name ? country.name : '';
  }
  cCodeDisplayFn(country: Country): string {
    return country && country.dial_code ? country.dial_code : '';
  }
  industryDisplayFn(industry: Industry): string {
    return industry && industry.name ? industry.name : '';
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
  private _filter(name: string,control: string): any {
    console.log(name);
    const filterValue = name.toLowerCase();
    let res;
    switch(control){
      case 'country':{
        res = this.countryInfoOptions.filter(option => option.name.toLowerCase().includes(filterValue));
        break;
      }
      case 'ccode':{
        res = this.countryInfoOptions.filter(option => option.dial_code.toLowerCase().includes(filterValue));
        break;
      }
      case 'industry':{
        res = this.industryOptions.filter(option => option.name.toLowerCase().includes(filterValue));
        break;
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
