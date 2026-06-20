import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { NavBar } from '../components/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lab2');
  protected readonly currentUrl = signal('/');
  loading: any;

  constructor(private loadingService: LoadingService, private router: Router){
    this.loading = this.loadingService.loading;
    this.currentUrl.set(this.router.url);
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  showNavbar() {
    const url = this.currentUrl().split('?')[0];
    return url === '/' || url.startsWith('/app') || url === '/login' || url === '/signup';
  }
}
