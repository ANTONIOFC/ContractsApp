import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { ContractList } from '../features/contracts/contract-list/contract-list';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { ContractDetail } from '../features/contracts/contract-detail/contract-detail';
import { contracsResolver } from '../features/contracts/contracs-resolver';
import { preventUnsavedChangesGuard } from '../core/guards/prevent-unsaved-changes-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'contracts',
        children:[
            {path: '', component: ContractList, title: 'Lista de Contratos'},
            {
                path:'new', component: ContractDetail, title: 'Novo Contrato',
                canDeactivate: [preventUnsavedChangesGuard]
            },
            {
                path: ':id',
                resolve: {contract: contracsResolver},
                runGuardsAndResolvers: 'always',
                component: ContractDetail,
                title: 'Detalhe do Contrato',
            },
        ]
    },    
    { path: 'server-error', component: ServerError},
    { path: '**', component: NotFound }
];
