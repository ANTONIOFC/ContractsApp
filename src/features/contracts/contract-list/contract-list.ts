import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ContractService } from '../../../core/services/contract-service';
import { filter, switchMap, take } from 'rxjs';
import { Contract } from '../../../types/contract';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfirmationModal } from "../../../shared/confirmation-modal/confirmation-modal";
import { ConfirmationModalService } from '../../../core/services/confirmation-modal-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-contract-list',
  imports: [RouterLink, DatePipe, CurrencyPipe, NgClass, ConfirmationModal],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.css'
})
export class ContractList implements OnInit {
  protected contractService = inject(ContractService);
  protected confirmationModalService = inject(ConfirmationModalService);
  private toast = inject(ToastService)
  
  constructor() {
    //this.contractService.getContracts(0,20);
  }

  ngOnInit(): void {
    this.contractService.getContracts(0,20);
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
}
