import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Marketplace } from './pages/marketplace/marketplace';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'marketplace', component: Marketplace },
  { path: 'contato', component: Contact },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redireciona qualquer rota inválida para a home
];