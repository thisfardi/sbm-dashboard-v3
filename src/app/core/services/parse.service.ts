import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ParseService {

    constructor() { }
    encode(param: Object){
        const formData = new FormData();
        for(let [key, value] of Object.entries(param)){
            formData.append(key, value);
        }
        return formData;
    }
}
