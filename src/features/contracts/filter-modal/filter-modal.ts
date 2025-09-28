import { Component, ElementRef, model, output, signal, ViewChild } from '@angular/core';
import { ContractParams } from '../../../types/contract';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css'
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<ContractParams>();
  contractParams = model(new ContractParams());

  protected statusList = ["emitido", "vigente", "cancelado"];
  protected categories = ['Eventual', 'Recorrente'];

/*   filterStatus: string = '';
  filterCategory: string = '';
  filterDate: string = ''; */
  filterType: string = '';
 
  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.contractParams.set(JSON.parse(filters));
    }
  }

  open() {
    this.modalRef.nativeElement.showModal();
  }

  close() {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  onRadioChange() {

    if (this.filterType === 's') {
      this.contractParams().status = '';  
      this.contractParams().category = undefined;
      this.contractParams().date_1 = undefined;
      this.contractParams().date_2 = undefined;
    } 
    else if (this.filterType === 'c') {
      this.contractParams().category = '';  
      this.contractParams().status = undefined;
      this.contractParams().date_1 = undefined;
      this.contractParams().date_2 = undefined;
    }     
    else if (this.filterType === 'd') { 
      this.contractParams().date_1 = '';
      this.contractParams().date_2 = '';
      this.contractParams().status = undefined;
      this.contractParams().category = undefined;
    }
    else {
      this.contractParams().status = undefined;
      this.contractParams().category = undefined; 
      this.contractParams().date_1 = undefined;
      this.contractParams().date_2 = undefined;
    }
  }

  resetFilters() {
    this.contractParams.set(new ContractParams());
    this.filterType = '';
  }

  // onDateChange(event: Event) {
  //   const input = event.target as HTMLInputElement; 
  //   if (input.checked) {
  //     this.filterDate = input.value;
  //   } else {
  //     this.filterDate = '';
  //     this.contractParams().date_1 = undefined;
  //     this.contractParams().date_2 = undefined;
  //   }
  // }

  // onCategoryChange(event: Event) {
  //   const input = event.target as HTMLInputElement; 
  //   if (input.checked) {
  //     this.filterCategory = input.value;
  //   } else {
  //     this.filterCategory = '';
  //     this.contractParams().category = undefined;
  //   }
  // }

  // onStatusChange(event: Event) {
  //   const input = event.target as HTMLInputElement;   
  //   if (input.checked) {
  //     this.filterStatus = input.value;
  //   } else {      
  //     this.filterStatus = '';
  //     this.contractParams().status = undefined;
  //   } 
  // }

  submit() {
    this.submitData.emit(this.contractParams());
    this.close();
  }
}
