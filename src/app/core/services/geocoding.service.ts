import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GeocodingService {
    private apiUrl = 'http://localhost:8080/api/weather';

    constructor(private http: HttpClient) { }

    geocodeCity(city: string): Observable<any> {
        const params = new HttpParams().set('city', city);
        return this.http.get(`${this.apiUrl}/geocode`, { params });
    }

    reverseGeocode(lat: number, lon: number): Observable<any> {
        const params = new HttpParams()
            .set('lat', lat.toString())
            .set('lon', lon.toString());
        return this.http.get(`${this.apiUrl}/reverse-geocode`, { params });
    }
}