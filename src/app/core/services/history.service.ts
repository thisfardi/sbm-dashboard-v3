import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    constructor() { }

    // user: user id,
    // event_number: 0 - login, 1 - page visit, 3- export
    // event_string: event_description
    logHistory(user: number, event_number: number, event_string: string){
        
    }

}
