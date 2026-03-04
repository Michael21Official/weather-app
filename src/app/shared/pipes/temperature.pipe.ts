import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'temperature',
    standalone: true
})
export class TemperaturePipe implements PipeTransform {
    transform(value: number, unit: 'C' | 'F' = 'C'): string {
        if (value === null || value === undefined) return '';

        if (unit === 'C') {
            return `${Math.round(value)}°C`;
        } else {
            const fahrenheit = (value * 9 / 5) + 32;
            return `${Math.round(fahrenheit)}°F`;
        }
    }
}