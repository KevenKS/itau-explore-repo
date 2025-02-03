import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faCode, faStar, faCodeFork, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Repository } from '../../models/repository';
import { GithubService } from '../../services/github.service';


@Component({
  selector: 'app-repo-search',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatCardModule, 
    MatListModule,
    MatProgressSpinnerModule,
    MatPaginatorModule, 
    FontAwesomeModule
  ],
  templateUrl: './repo-search.component.html',
  styleUrls: ['./repo-search.component.scss']
})
export class RepoSearchComponent implements OnInit, OnDestroy {
  searchTerm = '';
  repositories: Repository[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalCount = 0;
  faSearch = faSearch;
  faCode = faCode;
  faStar = faStar;
  faCodeFork = faCodeFork;
  faCircleExclamation = faCircleExclamation;
  private searchSubject = new Subject<string>();
  private subscription: Subscription = new Subscription();

  constructor(
    private githubService: GithubService,
    private router: Router
  ) {}
  
  // Para paginação sem delay
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.loadPage(this.searchTerm, this.currentPage + 1);
  }
  
  loadPage(term: string, page: number) {
    this.githubService.searchRepositories(term, page)
      .subscribe(response => {
        this.repositories = response.items;
        this.totalCount = Math.min(response.total_count, 60);
      });
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term) {
        this.currentPage = 0;
        this.performSearch(term);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchTermChanged(term: string) {
    this.searchSubject.next(term);
  }

  private performSearch(term: string) {
    this.githubService.searchRepositories(term, 1)
      .subscribe(response => {
        this.repositories = response.items.slice(0, 12);
        this.totalCount = Math.min(response.total_count, 60); // 12 itens * 5 páginas
      });
  }

  onKeyDown(event: KeyboardEvent, fullName: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToPulls(fullName);
    }
  }

  onArrowNavigation(event: KeyboardEvent | any, index: number) {
    const cards = document.querySelectorAll('.repo-card');
    if (event.key === 'ArrowDown' && index < cards.length - 1) {
      (cards[index + 1] as HTMLElement).focus();
    }
    if (event.key === 'ArrowUp' && index > 0) {
      (cards[index - 1] as HTMLElement).focus();
    }
  }

  navigateToPulls(fullName: string) {
    this.router.navigate(['/pulls', fullName]);
  }
}
