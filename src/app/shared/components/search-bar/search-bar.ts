import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './search-bar.html',
    styleUrls: ['./search-bar.scss']
})
export class SearchBarComponent {
    @Output() search = new EventEmitter<string>();
    city: string = '';

    onSearch() {
        if (this.city.trim()) {
            this.search.emit(this.city.trim());
            this.city = '';
        }
    }
}