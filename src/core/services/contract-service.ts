import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Contract } from '../../types/contract';
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

  getContracts(skipValue: number = 0, limitValue: number = 10) {

    const params = new HttpParams()
      .set('skip', skipValue.toString())
      .set('limit', limitValue.toString());

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
