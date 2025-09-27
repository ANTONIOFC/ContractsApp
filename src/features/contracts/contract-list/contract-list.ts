import { Component, inject } from '@angular/core';
import { ContractService } from '../../../core/services/contract-service';
import { Observable } from 'rxjs';
import { Contract } from '../../../types/contract';
import { AsyncPipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contract-list',
  imports: [AsyncPipe, RouterLink, DatePipe, CurrencyPipe, NgClass],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.css'
})
export class ContractList {
  private contractService = inject(ContractService);
  protected contracts$: Observable<Contract[]>;

  constructor() {
    this.contracts$ = this.contractService.getContracts();
  }

}
