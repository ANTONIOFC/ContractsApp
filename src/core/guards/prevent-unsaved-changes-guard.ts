import { CanDeactivateFn } from '@angular/router';
import { ContractDetail } from '../../features/contracts/contract-detail/contract-detail';

export const preventUnsavedChangesGuard: CanDeactivateFn<ContractDetail> = (component) => {
  if (component.contractForm.dirty) {
    return confirm('Você tem alterações não salvas. Tem certeza que deseja sair?');
  }

  return true;
};
