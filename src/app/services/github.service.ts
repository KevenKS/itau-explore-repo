import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private baseUrl = 'https://api.github.com';
  // criação do token para mais acesso a api
  private headers = new HttpHeaders({
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'Bearer seu_token_aqui'
  });

  constructor(private http: HttpClient) {}

  searchRepositories(language: string, page: number): Observable<any> {
    const url = `${this.baseUrl}/search/repositories?q=${language}+language:${language}&sort=stars&per_page=12&page=${page}`;
    return this.http.get(url, { headers: this.headers });
  }

  getPullRequests(owner: string, repo: string, page: number): Observable<any> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/pulls?state=all&per_page=12&page=${page}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((response: any) => {
        return {
          items: response,
          total_count: response.length * 5 // Para calcular o total de itens possíveis
        };
      })
    );
  }
}
