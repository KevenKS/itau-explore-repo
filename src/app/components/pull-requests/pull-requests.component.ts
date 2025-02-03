import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GithubService } from '../../services/github.service';
import { PullRequest } from '../../models/repository';
import { faCodePullRequest, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
    FontAwesomeModule
  ],
  templateUrl: './pull-requests.component.html',
  styleUrls: ['./pull-requests.component.scss']
})
export class PullRequestsComponent implements OnInit {
  repoName = '';
  pullRequests: PullRequest[] = [];
  paginatedPullRequests: PullRequest[] = [];
  pageSize = 12;
  currentPage = 0;
  isLoading = true;
  faCodePullRequest = faCodePullRequest;
  faUser = faUser;
  faCalendar = faCalendar;
  totalCount = 0;
  owner: string = '';
  repo: string = '';
  openPRCount = 0;
  closedPRCount = 0;
  page = 1;

  constructor(private route: ActivatedRoute, private githubService: GithubService) 
  {
    const fullName = this.route.snapshot.paramMap.get('fullName') || '';
    [this.owner, this.repo] = fullName.split('/');
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.githubService.getPullRequests(this.owner, this.repo, page)
      .subscribe(response => {
        this.pullRequests = response.items;
        this.totalCount = Math.min(response.total_count, 60); // 60 = 12 itens * 5 páginas
        this.updatePRCounts();
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.loadPage(this.currentPage + 1);
  }

  updatePRCounts() {
    this.openPRCount = this.pullRequests.filter(pr => pr.state === 'open').length;
    this.closedPRCount = this.pullRequests.filter(pr => pr.state === 'closed').length;
  }
}
