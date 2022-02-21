import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
@Injectable()
export class AppService{
    constructor(private httpClient: HttpClient) { }
    private SERVER_URL = 'http://13.127.219.224:3003/postForm';
    
    postFormData(data: FormData){
        //API CALL
        return this.httpClient.post<{message: string}>(this.SERVER_URL, data);
    }
}