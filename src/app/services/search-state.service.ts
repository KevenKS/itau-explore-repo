import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Repository } from '../models/repository';

interface SearchState {
  searchTerm: string;
  repositories: Repository[];
  currentPage: number;
  totalCount: number;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private initialState: SearchState = {
    searchTerm: '',
    repositories: [],
    currentPage: 0,
    totalCount: 0,
    isLoading: false
  };

  private state = new BehaviorSubject<SearchState>(this.initialState);

  setState(newState: Partial<SearchState>) {
    this.state.next({
      ...this.state.getValue(),
      ...newState
    });
  }

  getState() {
    return this.state;
  }

  getCurrentState(): SearchState {
    return this.state.getValue();
  }

  resetState() {
    this.state.next(this.initialState);
  }
}
