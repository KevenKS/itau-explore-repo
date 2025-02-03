import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {
  faArrowLeft = faArrowLeft;

  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
