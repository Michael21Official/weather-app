import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WeatherResponse } from '../../models/weather.model';
import { TemperaturePipe } from '../../pipes/temperature.pipe';

@Component({
    selector: 'app-weather-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, TemperaturePipe],
    templateUrl: './weather-card.html',
    styleUrls: ['./weather-card.scss']
})
export class WeatherCardComponent {
    @Input() weather!: WeatherResponse;

    getWeatherIconUrl(iconCode: string): string {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
}