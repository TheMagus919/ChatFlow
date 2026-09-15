import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionService } from '../../services/subscription.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  plans: any[] = [];
  currentPlan: any = {};
  loading = true;
  private subscriptionService = inject(SubscriptionService);

  constructor() {
    this.loadPlans();
    this.loadCurrentPlan();
  }

  async loadPlans() {
    this.plans = await firstValueFrom(this.subscriptionService.getPlans());
  }

  async loadCurrentPlan() {
    this.currentPlan = await firstValueFrom(this.subscriptionService.getCurrentPlan());
    this.loading = false;
  }

  async createCheckout(priceId: string) {
    const stripe = await loadStripe(environment.stripePublishableKey);
    const { sessionId } = await firstValueFrom(this.subscriptionService.createCheckout(priceId));

    if (!stripe) {
      console.error('Stripe failed to initialize.');
      return;
    }

    await stripe.redirectToCheckout({ sessionId });
  }
}
