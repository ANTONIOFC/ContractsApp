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
  editMode = signal(false);
  contract = signal<Contract | null>(null);

  getContracts(skipValue: number = 0, limitValue: number = 10) {

    const params = new HttpParams()
      .set('skip', skipValue.toString())
      .set('limit', limitValue.toString());

    return this.http.get<Contract[]>(this.baseUrl + 'contracts/', { params: params })
  }

  getContract(id: string) {
    return this.http.get<Contract>(this.baseUrl + 'contracts/' + id).pipe(
      tap(contract => {
        this.contract.set(contract)
      })
    )
  }

  updateContract(contract: Contract) {
    return this.http.put(this.baseUrl + 'contracts/' + contract.id, contract);
  }
}
