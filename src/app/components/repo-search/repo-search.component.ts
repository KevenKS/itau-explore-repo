import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { GithubService } from '../../services/github.service';
import { SearchStateService } from '../../services/search-state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faCode, faStar, faCodeFork, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

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
  state$ = new BehaviorSubject<any>(null);

  pageSize = 12;   // Definição do tamanho da página para paginação
  faSearch = faSearch;
  faCode = faCode;
  faStar = faStar;
  faCodeFork = faCodeFork;
  faCircleExclamation = faCircleExclamation;

  // Subjects para controle de busca e gerenciamento de memória
  private searchSubject = new Subject<string>();
  private subscription = new Subscription();

  constructor(
    private githubService: GithubService,
    private router: Router,
    private searchStateService: SearchStateService
  ) {
    this.state$ = this.searchStateService.getState();
  }

  // Inicialização do componente
  ngOnInit() {
    this.subscription.add(
      this.searchSubject.pipe(
        debounceTime(300),        // Aguarda 300ms entre inputs
        distinctUntilChanged()    // Evita chamadas duplicadas
      ).subscribe(term => {
        if (term) {
          this.searchStateService.setState({ currentPage: 0 });
          this.performSearch(term);
        }
      })
    );
  }

  // Limpeza de recursos ao destruir o componente. (Comentario da Eduarda)
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Método chamado quando o termo de busca muda
  searchTermChanged(term: string) {
    this.searchSubject.next(term);
  }

  // Manipulador de eventos de paginação
  onPageChange(event: PageEvent) {
    this.searchStateService.setState({ currentPage: event.pageIndex });
    const state = this.searchStateService.getState().getValue();
    this.loadPage(state.searchTerm, event.pageIndex + 1);
  }

  // Carrega uma página específica de resultados
  loadPage(term: string, page: number) {
    this.githubService.searchRepositories(term, page)
      .subscribe(response => {
        this.searchStateService.setState({
          repositories: response.items,
          totalCount: Math.min(response.total_count, 60)
        });
      });
  }

  // Realiza a busca inicial
  private performSearch(term: string) {
    this.githubService.searchRepositories(term, 1)
      .subscribe(response => {
        this.searchStateService.setState({
          repositories: response.items.slice(0, 12),
          totalCount: Math.min(response.total_count, 60),
          searchTerm: term
        });
      });
  }

  // Manipulador de eventos de teclado
  onKeyDown(event: KeyboardEvent, fullName: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToPulls(fullName);
    }
  }

  // Navegação por setas entre cards
  onArrowNavigation(event: KeyboardEvent | any, index: number) {
    const cards = document.querySelectorAll('.repo-card');
    if (event.key === 'ArrowDown' && index < cards.length - 1) {
      (cards[index + 1] as HTMLElement).focus();
    }
    if (event.key === 'ArrowUp' && index > 0) {
      (cards[index - 1] as HTMLElement).focus();
    }
  }

  // Navegação para página de pull requests
  navigateToPulls(fullName: string) {
    this.router.navigate(['/pulls', fullName]);
  }
}
