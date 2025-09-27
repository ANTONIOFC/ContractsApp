import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { EditableContract } from '../../../types/contract';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractService } from '../../../core/services/contract-service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal-service';
import { ConfirmationModal } from "../../../shared/confirmation-modal/confirmation-modal";
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-contract-detail',
  imports: [ReactiveFormsModule, ConfirmationModal],
  templateUrl: './contract-detail.html',
  styleUrl: './contract-detail.css'
})
export class ContractDetail implements OnInit, OnDestroy {
  
  private router = inject(Router);
  private location = inject(Location);
  protected confirmationModalService = inject(ConfirmationModalService);
  protected contractService = inject(ContractService);
  private toast = inject(ToastService)

  protected editableContract: EditableContract = {
    title: '',
    value: 0,
    category: '',
    due_date: '',
    status: '',
    supplier: ''
  }

  protected statusList = ["emitido", "vigente", "cancelado"];
  protected categories = ['Eventual', 'Recorrente'];

  private fb = inject(FormBuilder);
  protected contractForm: FormGroup;

  constructor() {
    this.contractForm = this.fb.group({
      title: ['', Validators.required],
      due_date: [undefined, Validators.required],
      value: [undefined, Validators.required],
      status: ['', Validators.required],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
      user: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.contractForm.patchValue(
      {
        title: this.contractService.contract()?.title || '',
        value: this.contractService.contract()?.value || 0,
        category: this.contractService.contract()?.category || '',
        due_date: this.contractService.contract()?.due_date || '',
        status: this.contractService.contract()?.status || '',
        supplier: this.contractService.contract()?.supplier || '',
        user: this.contractService.contract()?.user || ''
      }
    )
  }
  
  onSubmit() {

    this.confirmationModalService.open("Deseja efetuar a gravação do contrato ?");

    const updateContract = { ...this.contractService.contract(), ...this.contractForm.value };

    this.confirmationModalService.confirmAction$.pipe(
      filter(confirmed => confirmed === true),
      switchMap(() => this.contractService.saveContract(updateContract, this.contractService.editMode())),
      take(1)
    ).subscribe({
      next: () => {
          this.toast.success('Contrato gravado com sucesso !');
          this.router.navigateByUrl('/contracts');
      },
      error: (error) => {
        this.toast.error('Erro ao gravar o contrato !!!');
      }
    });
  }

  onCancelClick() {
    this.location.back();
  }

  ngOnDestroy(): void {
    
    this.contractService.contract.set(null);
    if (this.contractService.editMode()) {
      this.contractService.editMode.set(false);
    }
  }
}
