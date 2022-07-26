import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormComponent } from './form/form.component';
import { TranscriptsComponent } from './transcripts/transcripts.component';
import { ChatSidebarContainerComponent } from './transcripts/chat-sidebar-container/chat-sidebar-container.component';
import { ChatWindowComponent } from './transcripts/chat-window/chat-window.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FileComparisonDialogComponent } from './transcripts/file-comparison-dialog/file-comparison-dialog.component';
import { ErrorDialogComponent } from './form/error-dialog/error-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    TranscriptsComponent,
    ChatSidebarContainerComponent,
    ChatWindowComponent,
    LoginComponent,
    RegisterComponent,
    FileComparisonDialogComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatTableModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
