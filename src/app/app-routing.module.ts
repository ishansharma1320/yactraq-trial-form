import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {FormComponent} from './form/form.component';
import { TranscriptsComponent } from './transcripts/transcripts.component';
import {LoginComponent} from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
{path: 'form',component: FormComponent},
{path: 'transcripts',component: TranscriptsComponent},
{path: '',component: LoginComponent},
{path: 'register',component: RegisterComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
