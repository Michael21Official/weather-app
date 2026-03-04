import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../core/services/weather.service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';
import { WeatherCardComponent } from '../../shared/components/weather-card/weather-card';
import { WeatherResponse } from '../../shared/models/weather.model';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        SearchBarComponent,
        WeatherCardComponent,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    templateUrl: './home.html',
    styleUrls: ['./home.scss']
})
export class HomeComponent {
    weather: WeatherResponse | null = null;
    loading = false;
    error: string | null = null;

    constructor(private weatherService: WeatherService) { }

    onSearch(city: string) {
        this.loading = true;
        this.error = null;

        this.weatherService.getCurrentWeather(city).subscribe({
            next: (data) => {
                this.weather = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Nie udało się pobrać pogody';
                this.loading = false;
                this.weather = null;
            }
        });
    }
}