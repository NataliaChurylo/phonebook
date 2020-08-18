import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { IContact } from './../shared/interfaces/phonebook.interface';
import { Contact } from './../shared/models/phonebook.model'
import { PhonebookService } from './../shared/services/phonebook.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-phone-book',
  templateUrl: './phone-book.component.html',
  styleUrls: ['./phone-book.component.scss']
})
export class PhoneBookComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  searchData = '';

  firstName: string;
  lastName: string;
  phoneNumber: string;

  editContactID : number;
  editStatus = false;

  subscription: Subscription;
  
  phoneContacts: Array<IContact> = [];
  displayedColumns: string[] = ['firstname', 'lastname', 'phone', 'edit', 'delete'];
  dataSource = new MatTableDataSource(this.phoneContacts);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private modalService: BsModalService, 
    private contactService: PhonebookService
  ) { }

  ngOnInit(): void {
    this.getContactPhone();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  applyFilter(filterValue: string): void{
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openModal(modal: TemplateRef<any>, contact?: IContact) {
    this.modalRef = this.modalService.show(modal);
    if (contact) {
      this.editContactID = contact.id;
      this.firstName = contact.firstname;
      this.lastName = contact.lastname;
      this.phoneNumber = contact.phone;
      this.editStatus = true;
    }
  }

  getContactPhone(): void{
    this.subscription = this.contactService.getContacts().subscribe( data => {
      this.phoneContacts = data;
      this.dataSource = new MatTableDataSource(this.phoneContacts);
      this.dataSource.sort = this.sort;
    })
  }

  addContact(): void{
    const contact: IContact = new Contact(1, this.firstName, this.lastName, this.phoneNumber);
    if (!this.editStatus){
      if(this.phoneContacts.length > 0) {
        contact.id = this.phoneContacts.slice(-1)[0].id + 1;
      }
      this.contactService.addContact(contact).subscribe( () => {
        this.resetForm();
        this.getContactPhone();
      });
    }
    else{
      contact.id = this.editContactID;
      this.contactService.updateContact(contact).subscribe( () => {
        this.getContactPhone();
        this.resetForm();
      })
    }
    this.modalRef.hide();
  }

  // editContact(contact: IContact): void{
  //   this.editContactID = contact.id;
  //   this.firstName = contact.firstname;
  //   this.lastName = contact.lastname;
  //   this.phoneNumber = contact.phone
  //   this.editStatus = true;
  // }

  deleteContact(contact: IContact): void{
    this.contactService.deleteContact(contact).subscribe( () => {
      this.getContactPhone();
      });
  }

  resetForm(): void{
    this.firstName = '';
    this.lastName = '';
    this.phoneNumber = ''
  }
}
