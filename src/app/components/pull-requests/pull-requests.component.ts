import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GithubService } from '../../services/github.service';
import { PullRequest } from '../../models/repository';
import { faCodePullRequest, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin } from 'rxjs'; // Operador para combinar múltiplas requisições

@Component({
  selector: 'app-pull-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatCheckboxModule
  ],
  templateUrl: './pull-requests.component.html',
  styleUrls: ['./pull-requests.component.scss']
})
export class PullRequestsComponent implements OnInit {
  repoName = ''; // Nome do repositório
  pullRequests: PullRequest[] = []; // Lista de PRs da página atual
  paginatedPullRequests: PullRequest[] = []; // Lista paginada de PRs
  pageSize = 12; // Quantidade de itens por página
  currentPage = 0; // Índice da página atual
  isLoading = true; // Controle de loading
  
  // Ícones
  faCodePullRequest = faCodePullRequest;
  faUser = faUser;
  faCalendar = faCalendar;

  totalCount = 0; // Total de itens
  owner: string = ''; // Dono do repositório
  repo: string = ''; // Nome do repositório
  openPRCount = 0; // Contador de PRs abertos
  closedPRCount = 0; // Contador de PRs fechados
  page = 1; // Página inicial

  // Estados dos filtros
  filterOpen: boolean = false; // Filtro de PRs abertos
  filterClosed: boolean = false; // Filtro de PRs fechados

  // Arrays e contadores para os 60 PRs
  allPullRequests: PullRequest[] = []; // Todos os 60 PRs
  totalOpenPRs = 0; // Total de PRs abertos nos 60
  totalClosedPRs = 0; // Total de PRs fechados nos 60

  constructor(private route: ActivatedRoute, private githubService: GithubService) {
    const fullName = this.route.snapshot.paramMap.get('fullName') || '';
    [this.owner, this.repo] = fullName.split('/');
  }

  ngOnInit() {
    this.loadInitialData();
  }

  // Carrega os dados iniciais (60 PRs)
  loadInitialData() {
    this.isLoading = true;
    // Faz 5 requisições paralelas para obter todos os PRs necessários
    forkJoin([
      this.githubService.getPullRequests(this.owner, this.repo, 1),
      this.githubService.getPullRequests(this.owner, this.repo, 2),
      this.githubService.getPullRequests(this.owner, this.repo, 3),
      this.githubService.getPullRequests(this.owner, this.repo, 4),
      this.githubService.getPullRequests(this.owner, this.repo, 5)
    ]).subscribe(responses => {
      // Combina todos os resultados em um único array
      const allItems = responses.flatMap(response => response.items);
      // Pega os primeiros 60 PRs
      this.allPullRequests = allItems.slice(0, 60);
      
      // Calcula os totais de PRs abertos e fechados
      this.totalOpenPRs = this.allPullRequests.filter(pr => pr.state === 'open').length;
      this.totalClosedPRs = this.allPullRequests.filter(pr => pr.state === 'closed').length;
      
      // Define os valores iniciais
      this.totalCount = 60;
      this.openPRCount = this.totalOpenPRs;
      this.closedPRCount = this.totalClosedPRs;
      
      // Carrega a primeira página
      this.updatePageData(0);
      this.isLoading = false;
    });
  }

  // Atualiza os dados da página atual
  updatePageData(pageIndex: number) {
    let filteredPRs = this.allPullRequests;
    
    // Aplica os filtros se necessário
    if (this.filterOpen) {
      filteredPRs = this.allPullRequests.filter(pr => pr.state === 'open');
      this.totalCount = filteredPRs.length;
    } else if (this.filterClosed) {
      filteredPRs = this.allPullRequests.filter(pr => pr.state === 'closed');
      this.totalCount = filteredPRs.length;
    } else {
      this.totalCount = this.allPullRequests.length;
    }

    // Calcula os índices da página atual
    const startIndex = pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    // Atualiza a lista de PRs da página atual
    this.pullRequests = filteredPRs.slice(startIndex, endIndex);
  }

  // Manipula a mudança de página
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.updatePageData(this.currentPage);
  }

  // Alterna os filtros de PRs
  toggleFilter(type: 'open' | 'closed') {
    if (type === 'open') {
      this.filterOpen = !this.filterOpen;
      if (this.filterOpen) {
        this.filterClosed = false;
        this.openPRCount = this.totalOpenPRs;
        this.closedPRCount = 0;
      } else {
        this.openPRCount = this.totalOpenPRs;
        this.closedPRCount = this.totalClosedPRs;
      }
    } else {
      this.filterClosed = !this.filterClosed;
      if (this.filterClosed) {
        this.filterOpen = false;
        this.openPRCount = 0;
        this.closedPRCount = this.totalClosedPRs;
      } else {
        this.openPRCount = this.totalOpenPRs;
        this.closedPRCount = this.totalClosedPRs;
      }
    }
    
    // Reseta para a primeira página e atualiza os dados
    this.currentPage = 0;
    this.updatePageData(0);
  }
}
