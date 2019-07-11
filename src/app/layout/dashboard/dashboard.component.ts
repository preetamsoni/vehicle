import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { jsonData } from '../constant';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    myForm: FormGroup;
    isExpand = false;
    selectedBtn: any;
    page = 1;
    cercaData: any;
    isCollapsed = false;
    selectedIdx: any;
    selectedImg: any;

    constructor(private modalService: NgbModal) {}

    ngOnInit() {
        this.cercaData = jsonData.LdvResults;
        for (let item of this.cercaData) {
            item.date = moment(new Date(item.ProcessedTime)).format('DD/MM/YYYY');
            item.time = moment(new Date(item.ProcessedTime)).format('HH:mm:ss');
            item.isCollapsed = false;
        }
        let now = new Date();
        this.myForm = new FormGroup({
            ldv: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[\w\s]+$/), uppercaseValidator]),
            from_date: new FormControl(moment(now).subtract(7,'d').format('YYYY-MM-DD')),
            from_time: new FormControl(),
            to_date: new FormControl(moment(now).format('YYYY-MM-DD')),
            to_time: new FormControl(),
            itemsPerPage: new FormControl('5')            
        });
        let current_time = {
            hour: parseInt(moment(now).subtract(7,'d').format('HH')),
            minute: parseInt(moment(now).subtract(7,'d').format('mm'))
        }
        this.myForm.patchValue({from_time: current_time, to_time: current_time});

    }

    today() {
        this.selectedBtn = 'Oggi';
        let now = new Date();
        let from_time = { hour: 0, minute: 0 }
        let to_time = { hour: 23, minute: 59 }
        this.myForm.patchValue({from_date: moment(now).format('YYYY-MM-DD'), from_time: from_time, to_date: moment(now).format('YYYY-MM-DD'), to_time: to_time});
    }

    yesterday() {
        this.selectedBtn = 'Leri';
        let now = new Date();
        let from_time = { hour: 0, minute: 0 }
        let to_time = { hour: 23, minute: 59 }
        this.myForm.patchValue({from_date: moment(now).subtract(1,'d').format('YYYY-MM-DD'), from_time: from_time, to_date: moment(now).format('YYYY-MM-DD'), to_time: to_time});
    }

    last3Day() {
        this.selectedBtn = 'Ultimi 3gg';
        let now = new Date();
        let from_time = { hour: 0, minute: 0 }
        let to_time = { hour: 23, minute: 59 }
        this.myForm.patchValue({from_date: moment(now).subtract(3,'d').format('YYYY-MM-DD'), from_time: from_time, to_date: moment(now).format('YYYY-MM-DD'), to_time: to_time});
    }

    last7Day() {
        this.selectedBtn = 'Ultimi 7gg';
        let now = new Date();
        let from_time = { hour: 0, minute: 0 }
        let to_time = { hour: 23, minute: 59 }
        this.myForm.patchValue({from_date: moment(now).subtract(7,'d').format('YYYY-MM-DD'), from_time: from_time, to_date: moment(now).format('YYYY-MM-DD'), to_time: to_time});
    }

    lastMonth() {
        this.selectedBtn = 'Ultimo mese';
        let now = new Date();
        let from_time = { hour: 0, minute: 0 }
        let to_time = { hour: 23, minute: 59 }
        this.myForm.patchValue({from_date: moment(now).subtract(1,'months').format('YYYY-MM-DD'), from_time: from_time, to_date: moment(now).format('YYYY-MM-DD'), to_time: to_time});
    }

    reset(){
        this.myForm.reset();
        this.selectedBtn = '';
        this.isExpand = false;
        let now = new Date();
        let current_time = {
            hour: parseInt(moment(now).subtract(7,'d').format('HH')),
            minute: parseInt(moment(now).subtract(7,'d').format('mm'))
        }
        this.myForm.patchValue({ldv: '', from_date: moment(now).subtract(7,'d').format('YYYY-MM-DD'), from_time: current_time, to_date: moment(now).format('YYYY-MM-DD'), to_time: current_time, itemsPerPage: '5'});
        for (let item of this.cercaData) {
            item.isCollapsed = false;
        }
    }

    expand() {
        if (this.myForm.valid) {
            this.isExpand = true;
        }
    }

    open(content, image) {
        this.selectedImg = image;
        this.modalService.open(content, { windowClass: 'image-modal' });
    }

    onSubmit(data) {
        if (this.myForm.valid) {
            let jsnData = {
                'LdvToFind': data.ldv,
                'StartTimeSearch': data.from_date + ' ' + data.from_time.hour + ':' + data.from_time.minute + ':00',
                'EndTimeSearch': data.to_date + ' ' + data.to_time.hour + ':' + data.to_time.minute + ':00',
                'ApplicationType': 2,
                'ItemsPerPage': data.itemsPerPage,
                'Page': this.page           
            };
            console.log(jsnData);
        }
    }
}

export function uppercaseValidator(c: FormControl) {
    let regex = /^[A-Z]+$/g
    if (regex.test(c.value)) {
      return null;
    } else {
      return { uppercase: true }
    }
}
