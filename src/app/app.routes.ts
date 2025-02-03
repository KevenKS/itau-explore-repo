import { Routes } from '@angular/router';
import { RepoSearchComponent } from './components/repo-search/repo-search.component';
import { PullRequestsComponent } from './components/pull-requests/pull-requests.component';


export const routes: Routes = [
    { path: '', component: RepoSearchComponent },
    { path: 'pulls/:fullName', component: PullRequestsComponent }
];
