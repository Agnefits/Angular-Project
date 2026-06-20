import { JsonPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatched } from '../../validation/passwordMatch';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './singup.html',
  styleUrl: './singup.css',
})
export class Singup {
  userRegister: FormGroup;
  loading = false;
  error = '';
  infoMessage = '';
  private readonly apiUrl = 'http://localhost:5000/api/auth/signup';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.userRegister = fb.group(
      {
        username: ['', [Validators.required, Validators.pattern('[A-Za-z_]{3,}')]],
        address: fb.group({
          city: ['', [Validators.required]],
          street: ['', Validators.required],
        }),
        password: ['', [Validators.required]],
        confirmedPassword: ['', [Validators.required]],
      },
      { validators: [passwordMatched()] }
    );
  }

  get username() {
    return this.userRegister.get('username');
  }

  get password() {
    return this.userRegister.get('password');
  }

  get confirmPassword() {
    return this.userRegister.get('confirmedPassword');
  }

  submit() {
    if (this.userRegister.invalid) return;

    const user = this.userRegister.value;
    this.loading = true;
    this.error = '';

    this.http.post(this.apiUrl, {
      username: user.username,
      address: user.address,
      password: user.password,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to register user';
      },
    });
  }

  ngOnInit() {
    const msg = this.route.snapshot.queryParamMap.get('msg');
    if (msg) this.infoMessage = msg;
  }
}
