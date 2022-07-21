import { Component, OnInit,Inject, ViewChild, ElementRef} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup,ValidationErrors,Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// export interface DialogData {
//   animal: string;
//   name: string;
// }

@Component({
  selector: 'app-file-comparison-dialog',
  templateUrl: './file-comparison-dialog.component.html',
  styleUrls: ['./file-comparison-dialog.component.css']
})
export class FileComparisonDialogComponent implements OnInit {
  // @ViewChild('audio') audioVar: ElementRef;
  // segmentEnd = null;
  transcriptForm: FormGroup;
  success = false;
  constructor(
    public dialogRef: MatDialogRef<FileComparisonDialogComponent>,
    public formBuilder: FormBuilder
  ) {
    this.transcriptForm = this.formBuilder.group({
      man_trans: ['',Validators.required],
      start_time: [null, [Validators.pattern(/[0-9]{2}:[0-9]{2}:[0-9]{2}/),Validators.required]],
      end_time: ['', [Validators.pattern(/[0-9]{2}:[0-9]{2}:[0-9]{2}/),Validators.required]],  
    },{validator: this.differentDurations});
  }
  // onTimeUpdate(): void{
  //   if (this.segmentEnd && this.audioVar.nativeElement.currentTime >= this.segmentEnd) {
  //     this.audioVar.nativeElement.pause();
  //   }   
  //   console.log(this.audioVar.nativeElement.duration);
  // }
  //  playSegment(startTime, endTime): void {
  //   this.segmentEnd = endTime;
  //   this.audioVar.nativeElement.currentTime = startTime;
  //   this.audioVar.nativeElement.play();
  // }
  differentDurations(control: AbstractControl): ValidationErrors | null {
 
    const start = control.get("start_time").value;
    const end = control.get("end_time").value;
 
 
    if (start === end) { return { 'noMatch': true } }
 
    return null
 
  }
  private _reset(): void {
    this.transcriptForm.reset();
    Object.keys(this.transcriptForm.controls).forEach(key => {
      this.transcriptForm.get(key).setErrors(null) ;
    });
  }
  private _createFormData(): FormData{
    const formData = new FormData();
   
    Object.keys(this.transcriptForm.controls).forEach(key => {
      let value = this.transcriptForm.get(key).value;
      formData.append(key, value);      
     });
    return formData;
  }
  submit(): void{
    if (!this.transcriptForm.valid) {
      const invalid = [];
      const controls = this.transcriptForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              invalid.push(name);
          }
      }
      console.log('invalid')
      console.log(invalid);
      return;
      }
      this.success = true;
      
      const formData = this._createFormData();
      //API CALL STARTS
      console.log(formData);
      formData.forEach((val,key)=>{
        console.log(key,val,typeof(val));
      })
      // this.dialogCloseButton.nativeElement.click();
      this.onNoClick(this.success);
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
  onNoClick(val:any): void {
    val === null ? this.dialogRef.close(): this.dialogRef.close(val);
  }

  ngOnInit(): void {
  }

}
