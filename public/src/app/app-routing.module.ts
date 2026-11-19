import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { noAuthGuard } from './core/auth/no-auth.guard';
import { LandingComponent } from './features/auth/landing/landing.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
    canActivate: [noAuthGuard],
    title: 'Inbox Ledger — Forward a receipt. Get a ledger.',
  },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./features/transactions/transactions.module').then((m) => m.TransactionsModule),
      },
      {
        path: 'receipts',
        loadChildren: () =>
          import('./features/receipts/receipts.module').then((m) => m.ReceiptsModule),
      },
      {
        path: 'budgets',
        loadChildren: () => import('./features/budgets/budgets.module').then((m) => m.BudgetsModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

