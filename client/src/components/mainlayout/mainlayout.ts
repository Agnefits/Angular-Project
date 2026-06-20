import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './mainlayout.html',
  styleUrl: './mainlayout.css',
})
export class Mainlayout {}
