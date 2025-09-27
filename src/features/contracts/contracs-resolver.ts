import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ContractService } from '../../core/services/contract-service';
import { Contract } from '../../types/contract';
import { EMPTY } from 'rxjs';

export const contracsResolver: ResolveFn<Contract> = (route, state) => {
  const contractService = inject(ContractService);
  const router = inject(Router);
  const contractId = route.paramMap.get("id");

  if(!contractId) {
    router.navigateByUrl('/not-found');
    return EMPTY; 
  };

  return contractService.getContract(contractId);
};
