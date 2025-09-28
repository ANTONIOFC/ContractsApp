import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ContractService } from '../../../core/services/contract-service';
import { filter, switchMap, take } from 'rxjs';
import { Contract, ContractParams } from '../../../types/contract';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfirmationModal } from "../../../shared/confirmation-modal/confirmation-modal";
import { ConfirmationModalService } from '../../../core/services/confirmation-modal-service';
import { ToastService } from '../../../core/services/toast-service';
import { FilterModal } from "../filter-modal/filter-modal";

@Component({
  selector: 'app-contract-list',
  imports: [RouterLink, DatePipe, CurrencyPipe, NgClass, ConfirmationModal, FilterModal],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.css'
})
export class ContractList implements OnInit {
  protected contractService = inject(ContractService);
  protected confirmationModalService = inject(ConfirmationModalService);
  private toast = inject(ToastService);

  protected contractParams = new ContractParams();
  protected updatedParams = new ContractParams();
  @ViewChild('filterModal') modal!: FilterModal;
  
  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.contractParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters)
    }
  }

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts() {
    this.contractService.getContracts(this.contractParams);
  }

  onContractDelete(contract: Contract) {

    this.confirmationModalService.open("Deseja excluir o contrato '" + contract.title + "'?");

    this.confirmationModalService.confirmAction$.pipe(
      filter(confirmed => confirmed === true),
      switchMap(() => this.contractService.deleteContract(contract.id)),
      take(1)
    ).subscribe({
      next: () => {
        this.toast.success('Contrato excluído com sucesso !');
      },
       error: () => {
        this.toast.error('Erro ao excluir o contrato !!!');
      }
    })
  }

  onFilterChange(data: ContractParams) {
    this.contractParams = {...data};
    this.updatedParams = {...data};
    this.loadContracts()
  }

  resetFilters() {
    this.contractParams = new ContractParams();
    this.updatedParams = new ContractParams();
    this.loadContracts();
  }

  openModal() {
     this.modal.open();
  }

  onClose() {
    console.log('Modal closed')
  }
}
