import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  readonly currentYear = new Date().getFullYear();

  readonly features = [
    {
      icon: '💬',
      title: 'Conversaciones organizadas',
      description:
        'Centralizá los contactos de tu negocio y mantené cada interacción en un solo lugar.'
    },
    {
      icon: '📋',
      title: 'Pipeline de ventas',
      description:
        'Visualizá el estado de tus oportunidades y seguí el recorrido de cada cliente.'
    },
    {
      icon: '🏷️',
      title: 'Etiquetas personalizadas',
      description:
        'Clasificá tus contactos para encontrar rápidamente la información que necesitás.'
    },
    {
      icon: '📊',
      title: 'Estadísticas',
      description:
        'Consultá el rendimiento de tu negocio y entendé cómo evolucionan tus ventas.'
    }
  ];

  readonly steps = [
    {
      number: '01',
      title: 'Creá tu cuenta',
      description:
        'Registrá tu negocio y prepará tu espacio de trabajo.'
    },
    {
      number: '02',
      title: 'Organizá tus contactos',
      description:
        'Centralizá tus clientes y clasificá cada oportunidad.'
    },
    {
      number: '03',
      title: 'Convertí oportunidades en ventas',
      description:
        'Hacé seguimiento de tus conversaciones y controlá tus resultados.'
    }
  ];

  readonly plans = [
    {
      name: 'Free',
      limit: '10',
      description: 'Ideal para comenzar a organizar tus contactos.',
      featured: false
    },
    {
      name: 'Pro',
      limit: '100',
      description: 'Para negocios que necesitan gestionar más conversaciones.',
      featured: true
    },
    {
      name: 'Business',
      limit: '1.000',
      description: 'Para negocios con un mayor volumen de contactos.',
      featured: false
    }
  ];

  readonly mockColumns = [
    {
      title: 'Nuevos',
      count: 2,
      color: 'new',
      customers: [
        {
          name: 'Lucas López',
          phone: '266 123 4567',
          tag: 'Closed',
          tagColor: 'closed'
        },
        {
          name: 'Valentina Gómez',
          phone: '266 234 5678',
          tag: 'Follow Up',
          tagColor: 'follow'
        }
      ]
    },
    {
      title: 'En Conversación',
      count: 4,
      color: 'progress',
      customers: [
        {
          name: 'Nicolás Díaz',
          phone: '266 345 6789',
          tag: 'Hot Lead',
          tagColor: 'hot'
        },
        {
          name: 'Carla López',
          phone: '266 456 7890',
          tag: 'Closed',
          tagColor: 'closed'
        },
        {
          name: 'Juan Pérez',
          phone: '266 567 8901',
          tag: 'VIP',
          tagColor: 'vip'
        }
      ]
    },
    {
      title: 'Vendidos',
      count: 1,
      color: 'sold',
      customers: [
        {
          name: 'Lucía Díaz',
          phone: '266 678 9012',
          tag: 'Hot Lead',
          tagColor: 'hot'
        }
      ]
    }
  ];
}