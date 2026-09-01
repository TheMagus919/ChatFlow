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
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})

export class PricingComponent {

  plans: any[] = [];

  currentPlan: any = {};

  loading = true;

  private subscriptionService =
    inject(SubscriptionService);

  constructor() {

    this.loadPlans();

    this.loadCurrentPlan();
  }

  async loadPlans(): Promise<void> {

    try {

      this.plans =
        await firstValueFrom(
          this.subscriptionService.getPlans()
        );

    } catch (error) {

      console.error('Error loading plans', error);

    }

  }

  async loadCurrentPlan(): Promise<void> {

    try {

      this.currentPlan =
        await firstValueFrom(
          this.subscriptionService.getCurrentPlan()
        );

    } catch (error) {

      console.error(error);

    } finally {

      this.loading = false;

    }

  }

  async createCheckout(priceId: string): Promise<void> {

    try {

      const stripe = await loadStripe(
        environment.stripePublishableKey
      );

      if (!stripe) {

        console.error('Stripe failed to initialize');

        return;
      }

      const response =
        await firstValueFrom(
          this.subscriptionService.createCheckout(priceId)
        );

      await stripe.redirectToCheckout({
        sessionId: response.sessionId
      });

    } catch (error) {

      console.error('Checkout error', error);

    }

  }

}