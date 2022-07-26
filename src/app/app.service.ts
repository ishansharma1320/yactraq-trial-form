import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Country } from './models/country.model';
import { Industry } from './models/industry.model';
@Injectable()
export class AppService{
    constructor(private httpClient: HttpClient) { }
    private SERVER_URL = 'https://dev.ishans.dev/';
    
    isLoggedIn(){
        return this.httpClient.get<{message: Boolean}>('/auth/isLoggedIn');
    }

    getPlans(){
        return this.httpClient.get<{response: [{'_id': String, "value": String, "viewValue": String}]}>(this.SERVER_URL+'getPlan');
    }
    getLanguages(){
        return this.httpClient.get<{response: [{'_id': String, "value": String, "viewValue": String}]}>(this.SERVER_URL+'getLanguage');
    }
    getCallIdCheckStatus(body: any){
        return this.httpClient.post<{'success': Boolean, 'type':String, "response": Array<{fileName: String,call_id: String}>|null}>(`${this.SERVER_URL}newCallIdCheck`,body);
    }
    postRegistrationFormData(data: FormData){
        //API CALL
        return this.httpClient.post<{message: string, target: string}>('/auth/register', data);
    }
    postLoginFormData(data: FormData){
        //API CALL
        return this.httpClient.post<{message: string, target: string}>('/auth/login', data);
    }
    postFormData(data: FormData){
        //API CALL
        return this.httpClient.post<{message: String}>(this.SERVER_URL+'newForm', data);
    }
    postTranscriptFormData(data: FormData){
        //API CALL
        return this.httpClient.post<{message: String}>(this.SERVER_URL+'submitManualTranscript', data);
    }
    getConversations(call_id: string){
        let ep = `transcript/${call_id}`;
        return this.httpClient.get<{success: boolean, response: any[], wer_data: any}>(this.SERVER_URL+ep);
    }
}