import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { ContractList } from '../features/contracts/contract-list/contract-list';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { ContractDetail } from '../features/contracts/contract-detail/contract-detail';
import { contracsResolver } from '../features/contracts/contracs-resolver';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'contracts',
        children:[
            {path: '', component: ContractList},
            {
                path: ':id',
                resolve: {contract: contracsResolver},
                runGuardsAndResolvers: 'always',
                component: ContractDetail
            },
        ]
    },    
    { path: 'server-error', component: ServerError},
    { path: '**', component: NotFound }
];
