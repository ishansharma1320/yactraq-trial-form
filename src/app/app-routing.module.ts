import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {FormComponent} from './form/form.component';
import { TranscriptsComponent } from './transcripts/transcripts.component';


const routes: Routes = [
{path: 'form',component: FormComponent},
{path: 'transcripts',component: TranscriptsComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
