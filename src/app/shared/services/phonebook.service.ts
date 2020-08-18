import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContact } from '../interfaces/phonebook.interface';
import { environment } from '../../../../src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PhonebookService {

  constructor(private http: HttpClient) { }

  getContacts(): Observable<Array<IContact>>{
    return this.http.get<Array<IContact>>(`${environment.url}contacts`);
  }

  addContact(contact: IContact): Observable<Array<IContact>>{
    return this.http.post<Array<IContact>>(`${environment.url}contacts`,contact)
  }

  deleteContact(contact:IContact): Observable<Array<IContact>>{
    return this.http.delete<Array<IContact>>(`${environment.url}contacts/${contact.id}`)
  }

  updateContact(contact: IContact): Observable<Array<IContact>>{
    return this.http.put<Array<IContact>>(`${environment.url}contacts/${contact.id}`,contact)
  }

}
