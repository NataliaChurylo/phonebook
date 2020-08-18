import { IContact } from './../../shared/interfaces/phonebook.interface'

export class Contact implements IContact{
    
    constructor(
        public id: number,
        public firstname: string,
        public lastname: string,
        public phone: string
    ){}
}