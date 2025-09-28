import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Contract, ContractParams } from '../../types/contract';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private apiName = 'contracts/';

  editMode = signal(false);
  contract = signal<Contract | null>(null);
  readonly contracts = signal<Contract[]>([]);

  getContracts(contractParams: ContractParams) {

    this.apiName = 'contracts/'
    let params = new HttpParams();

    if (contractParams.category) {
      params = params.set('category', contractParams.category);
      this.apiName = 'contracts/by-category';
    }

    if (contractParams.status) {
      params = params.set('status', contractParams.status);
      this.apiName = 'contracts/by-status';
    }

    if (contractParams.date_1 && contractParams.date_2) {
      params = params.set('start_date', contractParams.date_1);
      params = params.set('end_date', contractParams.date_2);
      this.apiName = 'contracts/by-date-range';
    }

    params = params.set('skip', ((contractParams.pageNumber * contractParams.pageSize) - contractParams.pageSize).toString());
    params = params.set('limit', contractParams.pageSize.toString());
    
    this.http.get<Contract[]>(this.baseUrl + this.apiName, { params: params })
    .subscribe(contracts => {
      this.contracts.set(contracts);
    })
  }

  getContract(id: string) {
    return this.http.get<Contract>(this.baseUrl + this.apiName + id).pipe(
      tap(contract => {
        this.contract.set(contract)
      })
    )
  }

  saveContract(contract: Contract, isEditMode: boolean) {
    if (isEditMode) {
      return this.updateContract(contract);
    } else {
      return this.addContract(contract);
    }
  }

  addContract(contract: Contract) {
    return this.http.post(this.baseUrl + 'contracts', contract);
  }

  updateContract(contract: Contract) {
    return this.http.put(this.baseUrl + this.apiName + contract.id, contract);
  }

  deleteContract(id:number) {
    return this.http.delete(this.baseUrl + this.apiName + id).pipe(
      tap(() => {
          this.contracts.update(currentContracts => 
            currentContracts?.filter(c => c.id !== id)
          )
      })
    )
  }
}
