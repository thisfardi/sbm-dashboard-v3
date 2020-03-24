import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-miniloader',
    templateUrl: './miniloader.component.html',
    styleUrls: ['./miniloader.component.scss']
})
export class MiniloaderComponent implements OnInit {

    @Input() display = false;
    constructor() { }

    ngOnInit() {
    }

    /**
    * Shows the loader
    */
    show() {
        this.display = true;
    }

    /**
    * Hides the loader
    */
    hide() {
        this.display = false;
    }
}
