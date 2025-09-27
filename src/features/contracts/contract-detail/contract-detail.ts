import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Contract, EditableContract } from '../../../types/contract';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractService } from '../../../core/services/contract-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-contract-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './contract-detail.html',
  styleUrl: './contract-detail.css'
})
export class ContractDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  protected contractService = inject(ContractService);
  protected editableContract: EditableContract = {
    title: '',
    value: 0,
    category: '',
    due_date: '',
    status: '',
    supplier: ''
  }

  private toast = inject(ToastService)

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
      supplier: ['', Validators.required]
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
        supplier: this.contractService.contract()?.supplier || ''
      }
    )
  }

  onSubmit() {

    const updateContract = { ...this.contractService.contract(), ...this.contractForm.value }
    this.contractService.updateContract(updateContract).subscribe({
      next: () => {
        this.toast.success('Contrato gravado com sucesso !');
        this.contractService.editMode.set(false);
        this.contractService.contract.set(updateContract as Contract);
        this.contractForm?.reset(updateContract);
      },
      error: (error) => {
        this.toast.error('Erro ao gravar o contrato !!!')
      }
    })
  }

  onCancelClick() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.contractService.editMode()) {
      this.contractService.editMode.set(false);
    }
  }
}
