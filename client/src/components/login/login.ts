import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  error = '';
  private readonly apiUrl = 'http://localhost:5000/api/auth/login';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private auth: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    const username = (this.loginForm.value.username || '').toString().trim();
    const password = (this.loginForm.value.password || '').toString().trim();

    this.http.post<any>(this.apiUrl, { username, password }).subscribe({
      next: (response) => {
        const role = response?.data?.user?.role || 'user';
        this.auth.login({ token: response.token, role });
        this.router.navigate(['/app', 'products']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed';
      },
    });
  }
}
