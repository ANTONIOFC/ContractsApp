import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  private confirmActionSubject = new Subject<boolean>();
  confirmAction$ = this.confirmActionSubject.asObservable();
  
  private messageSubject = new Subject<string>();
  message$ = this.messageSubject.asObservable(); 

  open(message: string) {
    this.messageSubject.next(message);
    (document.getElementById('confirmation-modal') as HTMLDialogElement)?.showModal();
  }

  confirm() {
    this.confirmActionSubject.next(true);
    (document.getElementById('confirmation-modal')as HTMLDialogElement)?.close();
  }

  cancel() {
    this.confirmActionSubject.next(false);
    (document.getElementById('confirmation-modal')as HTMLDialogElement)?.close();
  }
}
