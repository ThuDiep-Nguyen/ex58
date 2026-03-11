import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FashionService } from '../services/fashion.service';
import { Fashion } from '../models/fashion.model';

@Component({
  selector: 'app-fashion-list',
  templateUrl: './fashion-list.component.html',
  standalone: false,
})
export class FashionListComponent implements OnInit {
  fashions: Fashion[] = [];
  successMsg = '';
  errorMsg = '';

  constructor(private fashionService: FashionService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadFashions();
  }

  loadFashions(): void {
    console.log('Starting loadFashions...');
    this.fashionService.getAll().subscribe({
      next: (data) => {
        console.log('Data received from API:', data);
        this.fashions = data;
        this.cdr.detectChanges(); // Use manual CD if zone is quirky
        console.log('Fashions array updated:', this.fashions);
      },
      error: (err) => {
        console.error('Lỗi load danh sách:', err);
        this.errorMsg = 'Không thể kết nối tới server: ' + (err.message || err.statusText);
        this.cdr.detectChanges(); // Also handle error state
      }
    });
  }

  deleteFashion(id: string): void {
    if (!confirm('Bạn có chắc muốn xóa Fashion này không?')) return;
    this.fashionService.delete(id).subscribe(() => {
      this.fashions = this.fashions.filter(f => f._id !== id);
      this.successMsg = 'Xóa thành công!';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.successMsg = '';
        this.cdr.detectChanges();
      }, 3000);
    });
  }
}
