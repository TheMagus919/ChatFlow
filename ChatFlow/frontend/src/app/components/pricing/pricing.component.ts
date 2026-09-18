import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { SubscriptionService } from '../../services/subscription.service';
import { environment } from '../../../environments/environment';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
}

interface CurrentPlan {
  plan: 'free' | 'pro' | 'business';
  status: string;
  customersLimit: number;
  isFree: boolean;
  renewalDate: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {

  plans: PricingPlan[] = [];

  currentPlan: CurrentPlan = {
    plan: 'free',
    status: 'inactive',
    customersLimit: 10,
    isFree: true,
    renewalDate: ''
  };

  loading = true;
  plansLoading = true;
  checkoutLoading = false;

  errorMessage = '';

  private subscriptionService = inject(SubscriptionService);

  constructor() {
    this.loadPlans();
    this.loadCurrentPlan();
  }

  async loadPlans() {
    try {
      const response = await firstValueFrom(
        this.subscriptionService.getPlans()
      );

      console.log('RESPUESTA COMPLETA DE PLANES:', response);

      this.plans = response?.plans ?? [];

      console.log('ARRAY PLANS:', this.plans);
    } catch (error) {
      console.error('ERROR CARGANDO PLANES:', error);
      this.plans = [];
    }
  }

  async loadCurrentPlan(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.subscriptionService.getCurrentPlan()
      );

      this.currentPlan = {
        plan: response?.plan ?? 'free',
        status: response?.status ?? 'inactive',
        customersLimit: Number(response?.customersLimit) || 10,
        isFree: response?.isFree ?? true,
        renewalDate: response?.renewalDate ?? ''
      };

    } catch (error) {
      console.error('Error cargando suscripción actual:', error);

      this.currentPlan = {
        plan: 'free',
        status: 'inactive',
        customersLimit: 10,
        isFree: true,
        renewalDate: ''
      };

    } finally {
      this.updateLoadingState();
    }
  }

  private updateLoadingState(): void {
    this.loading = this.plansLoading;
  }

  isCurrentPlan(plan: PricingPlan): boolean {
    const normalizedName = this.normalizePlanName(plan.name);

    return normalizedName === this.currentPlan.plan;
  }

  private normalizePlanName(name: string): 'free' | 'pro' | 'business' {
    const normalized = name
      .toLowerCase()
      .trim();

    if (normalized.includes('business')) {
      return 'business';
    }

    if (normalized.includes('pro')) {
      return 'pro';
    }

    return 'free';
  }

  getPlanDisplayName(plan: PricingPlan): string {
    const normalized = this.normalizePlanName(plan.name);

    switch (normalized) {
      case 'pro':
        return 'Pro';

      case 'business':
        return 'Business';

      default:
        return 'Gratis';
    }
  }

  getCurrentPlanDisplayName(): string {
    switch (this.currentPlan.plan) {
      case 'pro':
        return 'Pro';

      case 'business':
        return 'Business';

      default:
        return 'Gratis';
    }
  }

  getCurrentPlanStatus(): string {
    switch (this.currentPlan.status) {
      case 'active':
        return 'Activa';

      case 'cancelled':
        return 'Cancelada';

      case 'past_due':
        return 'Pago pendiente';

      case 'inactive':
        return 'Sin suscripción';

      default:
        return this.currentPlan.status || 'Sin suscripción';
    }
  }

  async createCheckout(priceId: string | undefined): Promise<void> {

    if (!priceId) {
      this.errorMessage = 'El plan seleccionado no está disponible.';
      return;
    }

    try {

      const response = await firstValueFrom(
        this.subscriptionService.createCheckout(priceId)
      );

      if (!response?.url) {
        this.errorMessage = 'No se pudo obtener la página de pago.';
        return;
      }

      window.location.href = response.url;

    } catch (error: any) {
      this.errorMessage =
        error?.error?.message ||
        error?.error?.error ||
        'No se pudo iniciar el pago.';
    }
  }

  get isCheckoutDisabled(): boolean {
    return this.checkoutLoading || this.loading;
  }
}