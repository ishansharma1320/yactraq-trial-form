import { Component, OnInit,ViewChild,ElementRef, AfterViewInit } from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
import { UntypedFormGroup, FormControl, Validators, UntypedFormArray, UntypedFormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppService } from '../app.service';
import { Plan } from '../models/plans.model';
import { Language } from '../models/languages.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';


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
  trialForm: UntypedFormGroup;
  manualTranscripts = [];
  invalidTranscripts: {message_body: string, message_title: string, call: string}[] = [];
  constructor(private appService: AppService,public router: Router, public formBuilder: UntypedFormBuilder, public dialog: MatDialog) { 
    this.trialForm = this.formBuilder.group({
      account_id: ['', Validators.required],
      lang: ['', Validators.required],
      plans:  ['', Validators.required],
      // man_trans: [''],
      // start_time: [null, Validators.pattern(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)],
      // end_time: ['', Validators.pattern(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)],
      fileSource: this.formBuilder.array([],Validators.required),
      
    },
    // {validator: this.differentDurations}
    );
  }

  // differentDurations(control: AbstractControl): ValidationErrors | null {
 
  //   const start = control.get("start_time").value;
  //   const end = control.get("end_time").value;
 
 
  //   if (start === end && start != null) { return { 'noMatch': true } }
 
  //   return null
 
  // }

  openDialog(data: {messages: any,option: string}): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent,{data});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this._reset();
    });
  }



  get fileSource(): UntypedFormArray {
    console.log(this.trialForm);
    return this.trialForm.get('fileSource') as UntypedFormArray;
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
        
        reader.onload = (e: any) => {
          // console.log('e.target.result', e.target.result);
          // console.log(typeof(e.target.result));
          if(file.type.includes('audio')){
            const blob = new Blob([new Uint8Array(e.target.result)], {
              type: file.type,
            });
            this.fileSource.push(this.createItem({file,blob}));
          }else if(file.type.includes('text') && file.name.includes('.txt')){
            let [start,end,text] = e.target.result.split('\n');
            let obj = {start, end, text,call: file.name.split('.txt')[0],valid: false};

            if(start !== undefined && end !== undefined && text !== undefined){
              if(new RegExp(/[0-9]{2}:[0-9]{2}:[0-9]{2}/).test(start) && new RegExp(/[0-9]{2}:[0-9]{2}:[0-9]{2}/).test(end)){
                if(start !== end){
                  obj.valid = true;
                }else{
                  obj.call = file.name;
                  obj['message_body'] = `${obj.call} have same start and end timestamps.`;
                  obj['message_title'] = `Same Timestamps`;
                }  
              }else{
                obj.call = file.name;
                obj['message_body'] = `${obj.call} has improperly formatted start or end timestamps.\n\tFormat:- HH:MM:SS`;
                obj['message_title'] = `Improper Timestamp format`;
              }  
            }else{
              obj.call = file.name;
              obj['message_body'] = `${obj.call} has invalid file format. Format:-\n\t<Start_Timestamp> (HH:MM:SS)\n\t<End_Timestamp> (HH:MM:SS)\n\t<paragraph>`;
              obj['message_title'] = `Invalid File Format`;
            }
            if(!this.manualTranscripts.some(item=>item.call === obj.call)){
              this.manualTranscripts.push(obj);
            }
          }
          
        };
        if(file.type.includes('audio')){
        reader.readAsArrayBuffer(file);
        }else if(file.type.includes('text') && file.name.includes('.txt')){
          reader.readAsText(file);
        }
      }
      
    }
  }

  createItem(data: any): UntypedFormGroup {
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
    this.manualTranscripts = [];
    this.invalidTranscripts = [];

  }
  private _createFormData(): any{
    const formData = new FormData();
    const validTranscripts = [];
    

    const metadata = {};
    
    for(let item of this.manualTranscripts){
      if(item.valid === true){
        validTranscripts.push(item);
      }else{
          let newItem = {call: item.call, message_body: item.message_body, message_title: item.message_title};
          this.invalidTranscripts.push(newItem);
      } 
    }
    console.log(this.manualTranscripts);
    console.log('valid',validTranscripts);
    formData.append('manual_transcripts',JSON.stringify(validTranscripts));
    Object.keys(this.trialForm.controls).forEach(key => {
        if(key === 'fileSource'){
          this.trialForm.get(key).value.forEach((item: any)=>{
            if(item.blob && item.file){
              formData.append(key, item.blob,item.file.name);
              if(metadata[key] === undefined){
                metadata[key] = [item.file.name]
              }else{
                metadata[key].push(item.file.name)
              }
            }
          }) 
        }
        else{
          let value = this.trialForm.get(key).value !== '' && this.trialForm.get(key).value != null ?this.trialForm.get(key).value:null;
          formData.append(key, value);
          metadata[key] = value;
        }
   });
    let res = {};
    res['form']= formData; 
    res['meta']= metadata; 
    return res;
  }
 
private _innerSubmit(formData: FormData): void {
  this.appService.postFormData(formData).subscribe((success)=>{
    this.formSubmitted = true;
    this._reset();
  },(failure)=>{
    this.formSubmitted = false;
    if(failure.status === 403){
      this.notAuthorised = true;
      this.message = failure.error.message;
    }
  });
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
    
    const res = this._createFormData();
    let formData = res.form;
    let metadata = res.meta;
    let checkBody = []
    console.log(metadata);
    metadata.fileSource.forEach(file=>{
      let name = file.split('.')[0];
      metadata.plans.forEach(plan=>{
        checkBody.push({fileName: file, call_id: `${metadata.account_id}_${name}_${metadata.lang}_${plan}`});
      })
      
    })
    for(const pair of formData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
    //API CALL STARTS
    
    // console.log('blob: ',files[0]);
    // console.log('name: ',files[0].name);
    this.appService.getCallIdCheckStatus(checkBody).subscribe((success)=>{
      if(success.success === true){
        let type = success.type;
        if(type === 'some_call_ids_exists' || type === 'all_new_call_ids'){
          let meta = success.response;
          let fileNames = [...new Set(meta.map(item=>item.fileName))];
          let files = formData.getAll('fileSource');  
          formData.append('metadata',JSON.stringify(meta));
          let newFiles = files.filter(file=>{
            if(fileNames.indexOf(file.name)>-1){
              return file;
            }
          });
          if(newFiles.length > 0){
            formData.delete('fileSource');
            newFiles.forEach((file)=>{
              formData.append('fileSource',file,file.name);
              });
          }
          this._innerSubmit(formData);
        }
        else{
          this.openDialog({messages: null,option: 'all_call_ids_exists'});
          return;
        }
        if(this.invalidTranscripts.length>0){
          let error_messages = this.invalidTranscripts;
          this.openDialog({messages:error_messages, option: 'other_errors'});
        }else{
          this._reset();
        }
        
      }
    },failure=>{
      console.log(failure);
    })
    
    
    
    
    
  }
  
  title = 'yactraq-transcripts-trial';
}
