import { Component } from '@angular/core';
import { NavBar } from '../nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [NavBar,RouterOutlet],
  templateUrl: './mainlayout.html',
  styleUrl: './mainlayout.css',
})
export class Mainlayout {}
