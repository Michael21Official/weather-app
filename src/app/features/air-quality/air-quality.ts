import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { WeatherService } from '../../core/services/weather.service';
import { AirPollutionResponse, AQI_LEVELS } from '../../shared/models/air-pollution.model';
import { GeocodingService } from '../../core/services/geocoding.service';

@Component({
    selector: 'app-air-quality',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatListModule,
        RouterLink
    ],
    templateUrl: './air-quality.html',
    styleUrls: ['./air-quality.scss']
})
export class AirQualityComponent implements OnInit {
    city: string = '';
    airQuality: AirPollutionResponse | null = null;
    loading = false;
    error: string | null = null;
    coordinates: { lat: number; lon: number } | null = null;

    aqiLevels = AQI_LEVELS;

    constructor(
        private route: ActivatedRoute,
        private weatherService: WeatherService,
        private geocodingService: GeocodingService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.city = params['city'];
            if (this.city) {
                this.getCoordinatesAndAirQuality();
            }
        });
    }

    getCoordinatesAndAirQuality() {
        this.loading = true;
        this.error = null;

        this.geocodingService.geocodeCity(this.city).subscribe({
            next: (geoData: any[]) => {
                if (geoData && geoData.length > 0) {
                    const location = geoData[0];
                    this.coordinates = {
                        lat: location.lat,
                        lon: location.lon
                    };
                    this.getAirQuality(this.coordinates.lat, this.coordinates.lon);
                } else {
                    this.error = 'Nie znaleziono miasta';
                    this.loading = false;
                }
            },
            error: (err) => {
                this.error = 'Nie udało się pobrać współrzędnych miasta';
                this.loading = false;
            }
        });
    }

    getAirQuality(lat: number, lon: number) {
        this.weatherService.getAirPollution(lat, lon).subscribe({
            next: (data) => {
                this.airQuality = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Nie udało się pobrać jakości powietrza';
                this.loading = false;
            }
        });
    }

    getAqiLabel(aqi: number): string {
        return this.aqiLevels[aqi]?.label || 'Nieznany';
    }

    getAqiColor(aqi: number): string {
        return this.aqiLevels[aqi]?.color || 'gray';
    }

    getAqiDescription(aqi: number): string {
        const descriptions = {
            1: 'Powietrze jest czyste. Możesz swobodnie przebywać na zewnątrz.',
            2: 'Powietrze jest akceptowalne. Osoby wrażliwe powinny ograniczyć aktywność na zewnątrz.',
            3: 'Powietrze może być szkodliwe dla osób wrażliwych. Rozważ ograniczenie czasu na zewnątrz.',
            4: 'Powietrze jest szkodliwe dla wszystkich. Ogranicz przebywanie na zewnątrz.',
            5: 'Powietrze jest bardzo szkodliwe. Unikaj wychodzenia na zewnątrz.'
        };
        return descriptions[aqi as keyof typeof descriptions] || 'Brak danych';
    }

    formatPollutant(value: number, unit: string): string {
        if (value === undefined || value === null) return 'Brak danych';
        return `${value.toFixed(1)} ${unit}`;
    }
}