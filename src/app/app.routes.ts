import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',

        loadComponent: () => import('./features/home/home').then(m => m.HomeComponent),
        title: 'Pogoda - Strona główna'
    },
    {
        path: 'forecast/:city',
        loadComponent: () => import('./features/forecast/forecast').then(m => m.ForecastComponent),
        title: 'Prognoza 5-dniowa'
    },
    {
        path: 'air-quality/:city',
        loadComponent: () => import('./features/air-quality/air-quality').then(m => m.AirQualityComponent),
        title: 'Jakość powietrza'
    },
    {
        path: '**',
        redirectTo: ''
    }
];