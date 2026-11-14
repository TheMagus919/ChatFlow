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
    { icon: 'forum', title: 'Todas tus conversaciones en un solo lugar', description: 'Centralizá los contactos de tu negocio y mantené cada conversación organizada.' },
    { icon: 'view_kanban', title: 'Visualizá tu proceso de ventas', description: 'Seguí cada oportunidad desde el primer contacto hasta el cierre.' },
    { icon: 'sell', title: 'Organizá con etiquetas', description: 'Clasificá tus clientes para encontrar rápidamente la información que necesitás.' },
    { icon: 'insights', title: 'Medí tus resultados', description: 'Consultá estadísticas para entender cómo avanza tu negocio.' }
  ];

  readonly steps = [
    { number: '01', title: 'Registrá tu negocio', description: 'Creá tu cuenta y comenzá a organizar tu espacio de trabajo.' },
    { number: '02', title: 'Centralizá tus contactos', description: 'Reuní la información de tus clientes y sus conversaciones.' },
    { number: '03', title: 'Gestioná y convertí', description: 'Organizá oportunidades, hacé seguimiento y medí tus resultados.' }
  ];

  readonly plans = [
    { name: 'Free', limit: '10', description: 'Para comenzar a organizar tus contactos.' },
    { name: 'Pro', limit: '100', description: 'Para negocios que quieren crecer y ordenar más conversaciones.', featured: true },
    { name: 'Business', limit: '1.000', description: 'Para equipos y negocios con un mayor volumen de contactos.' }
  ];
}
