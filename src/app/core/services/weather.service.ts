import { environment } from '../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../../shared/models/weather.model';
import { ForecastResponse } from '../../shared/models/forecast.model';
import { AirPollutionResponse } from '../../shared/models/air-pollution.model';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCurrentWeather(city: string): Observable<WeatherResponse> {
        const params = new HttpParams().set('city', city);
        return this.http.get<WeatherResponse>(`${this.apiUrl}/current`, { params });
    }

    // Bieżąca pogoda po współrzędnych
    getCurrentWeatherByCoords(lat: number, lon: number): Observable<WeatherResponse> {
        const params = new HttpParams()
            .set('lat', lat.toString())
            .set('lon', lon.toString());
        return this.http.get<WeatherResponse>(`${this.apiUrl}/current/by-coords`, { params });
    }

    // Prognoza 5-dniowa
    get5DayForecast(city: string): Observable<ForecastResponse> {
        const params = new HttpParams().set('city', city);
        return this.http.get<ForecastResponse>(`${this.apiUrl}/forecast/5day`, { params });
    }

    // Jakość powietrza
    getAirPollution(lat: number, lon: number): Observable<AirPollutionResponse> {
        const params = new HttpParams()
            .set('lat', lat.toString())
            .set('lon', lon.toString());
        return this.http.get<AirPollutionResponse>(`${this.apiUrl}/air-pollution`, { params });
    }

    // Geokodowanie
    geocodeCity(city: string): Observable<any> {
        const params = new HttpParams().set('city', city);
        return this.http.get(`${this.apiUrl}/geocode`, { params });
    }

    // Odwrotne geokodowanie
    reverseGeocode(lat: number, lon: number): Observable<any> {
        const params = new HttpParams()
            .set('lat', lat.toString())
            .set('lon', lon.toString());
        return this.http.get(`${this.apiUrl}/reverse-geocode`, { params });
    }
}