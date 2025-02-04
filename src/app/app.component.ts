import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchStateService } from './services/search-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private searchStateService: SearchStateService) {}

  onLogoClick() {
    this.searchStateService.setState({
      searchTerm: '',
      repositories: [],
      totalCount: 0,
      currentPage: 0
    });
  }
}
