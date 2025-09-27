import { Component, inject, OnDestroy } from '@angular/core';
import { ConfirmationModalService } from '../../core/services/confirmation-modal-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css'
})
export class ConfirmationModal implements OnDestroy {
  message: string = '';
  private messageSubscription: Subscription;

  private confirmationModalService = inject(ConfirmationModalService);
  
  constructor() {
     this.messageSubscription = this.confirmationModalService.message$.subscribe(message => {
      this.message = message;
    });
  }

  onConfirm() {
    this.confirmationModalService.confirm();
  }

  onCancel() {
    this.confirmationModalService.cancel();
  }

   ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

}
