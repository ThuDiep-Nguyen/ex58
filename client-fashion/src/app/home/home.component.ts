import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FashionService } from '../services/fashion.service';
import { Fashion } from '../models/fashion.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
})
export class HomeComponent implements OnInit {
  fashions: Fashion[] = [];
  styles = ['Street Style', 'Casual', 'Formal'];
  searchStyle = '';

  constructor(
    private fashionService: FashionService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.fashionService.getAll().subscribe({
      next: (data) => {
        console.log('Fashions loaded:', data);
        this.fashions = data;
        this.cdr.detectChanges(); // Ép buộc cập nhật giao diện
      },
      error: (err) => {
        console.error('Error loading fashions:', err);
      }
    });
  }

  // Lọc fashion theo style
  getFashionsByStyle(style: string): Fashion[] {
    return this.fashions.filter(f => f.style === style);
  }

  // Fashion hiển thị khi đang search
  get filteredFashions(): Fashion[] {
    if (!this.searchStyle) return [];
    return this.fashions.filter(f =>
      f.style.toLowerCase().includes(this.searchStyle.toLowerCase())
    );
  }

  onSelectStyle(style: string): void {
    this.searchStyle = style;
  }

  clearSearch(): void {
    this.searchStyle = '';
  }

  goDetail(id: string): void {
    this.router.navigate(['/detail', id]);
  }
}
