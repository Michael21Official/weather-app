import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { WeatherService } from '../../core/services/weather.service';
import { ForecastResponse, ForecastItem } from '../../shared/models/forecast.model';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';

@Component({
    selector: 'app-forecast',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatTabsModule,
        RouterLink,
        TemperaturePipe
    ],
    templateUrl: './forecast.html',
    styleUrls: ['./forecast.scss']
})
export class ForecastComponent implements OnInit {
    city: string = '';
    forecast: ForecastResponse | null = null;
    loading = false;
    error: string | null = null;

    // Prognoza pogrupowana po dniach
    groupedForecast: Map<string, ForecastItem[]> = new Map();
    days: string[] = [];

    constructor(
        private route: ActivatedRoute,
        private weatherService: WeatherService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.city = params['city'];
            if (this.city) {
                this.getForecast();
            }
        });
    }

    getForecast() {
        this.loading = true;
        this.error = null;

        this.weatherService.get5DayForecast(this.city).subscribe({
            next: (data) => {
                this.forecast = data;
                this.groupForecastByDay();
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Nie udało się pobrać prognozy';
                this.loading = false;
            }
        });
    }

    groupForecastByDay() {
        if (!this.forecast) return;

        this.groupedForecast.clear();

        this.forecast.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toLocaleDateString('pl-PL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });

            if (!this.groupedForecast.has(dayKey)) {
                this.groupedForecast.set(dayKey, []);
            }
            this.groupedForecast.get(dayKey)?.push(item);
        });

        this.days = Array.from(this.groupedForecast.keys());
    }

    getWeatherIconUrl(iconCode: string): string {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    getDayStats(items: ForecastItem[]): {
        tempMin: number;
        tempMax: number;
        weatherMain: string;
        weatherIcon: string;
        pop: number;
    } {
        let tempMin = Infinity;
        let tempMax = -Infinity;
        let weatherMain = '';
        let weatherIcon = '';
        let totalPop = 0;

        items.forEach(item => {
            tempMin = Math.min(tempMin, item.main.temp_min);
            tempMax = Math.max(tempMax, item.main.temp_max);

            // Weź główny opis z południa (około 12:00)
            const hour = new Date(item.dt * 1000).getHours();
            if (hour >= 11 && hour <= 13) {
                weatherMain = item.weather[0].main;
                weatherIcon = item.weather[0].icon;
            }

            totalPop += item.pop;
        });

        // Średnie prawdopodobieństwo opadów
        const avgPop = totalPop / items.length;

        // Jeśli nie znaleziono ikony z południa, weź pierwszą
        if (!weatherIcon && items.length > 0) {
            weatherMain = items[0].weather[0].main;
            weatherIcon = items[0].weather[0].icon;
        }

        return {
            tempMin: tempMin === Infinity ? 0 : tempMin,
            tempMax: tempMax === -Infinity ? 0 : tempMax,
            weatherMain,
            weatherIcon,
            pop: avgPop
        };
    }

    getHourString(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getPopPercentage(pop: number): string {
        return `${Math.round(pop * 100)}%`;
    }
}