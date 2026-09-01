import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CustomerListComponent } from './components/customers/customers.component';
import { authGuard } from './guards/auth-guard';
import { PipelineComponent } from './pipeline/pipeline.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { ConversationsComponent } from './components/conversation/conversation.component';
import { TagsComponent } from './components/tags/tags.component';
import { StatisticsComponent } from './components/stats/statistics.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, 
  { path: 'pipeline', component: PipelineComponent, canActivate: [authGuard] },
  { path: 'pricing', component: PricingComponent, canActivate: [authGuard] },
  { path: 'conversations/:customerId', component: ConversationsComponent, canActivate: [authGuard] },
  { path: 'conversations', component: ConversationsComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomerListComponent, canActivate: [authGuard] },
  { path: 'stats', component: StatisticsComponent, canActivate: [authGuard] },
  { path: 'tags', component: TagsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/pipeline', pathMatch: 'full' },
  { path: '**', redirectTo: '/pipeline' }
];