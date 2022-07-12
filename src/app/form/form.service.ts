import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class AppService{
    constructor(private httpClient: HttpClient) { }
    private SERVER_URL = 'https://dev.ishans.dev/';
    
    getPlans(){
        return this.httpClient.get<{response: [{'_id': String, "value": String, "viewValue": String}]}>(this.SERVER_URL+'getPlan');
    }
    getLanguages(){
        return this.httpClient.get<{response: [{'_id': String, "value": String, "viewValue": String}]}>(this.SERVER_URL+'getLanguage');
    }
    
    postFormData(data: FormData){
        //API CALL
        return this.httpClient.post<{message: String}>(this.SERVER_URL+'postForm', data);
    }
}