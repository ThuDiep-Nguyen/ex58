import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionService } from '../services/fashion.service';
import { Fashion } from '../models/fashion.model';
import Quill from 'quill';

@Component({
  selector: 'app-fashion-form',
  templateUrl: './fashion-form.component.html',
  standalone: false,
})
export class FashionFormComponent implements OnInit, AfterViewInit, OnDestroy {
  fashion: Fashion = { title: '', details: '', thumbnail: '', style: '' };
  isEdit = false;
  id = '';
  styles = ['Street Style', 'Casual', 'Formal'];
  private quill!: Quill;

  constructor(
    private fashionService: FashionService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.fashionService.getById(this.id).subscribe(data => {
        this.fashion = data;
        if (this.quill) {
          this.quill.root.innerHTML = data.details || '';
        }
        this.cdr.detectChanges();
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fashion.thumbnail = e.target.result; // Base64 string
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.fashion.thumbnail = '';
  }

  ngAfterViewInit(): void {
    this.quill = new Quill('#detailsEditor', {
      theme: 'snow',
      placeholder: 'Nhập nội dung chi tiết...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    if (this.isEdit && this.fashion.details) {
      this.quill.root.innerHTML = this.fashion.details;
    }
  }

  ngOnDestroy(): void {
    // Quill does not need explicit destroy
  }

  saveFashion(): void {
    this.fashion.details = this.quill.root.innerHTML;

    if (this.isEdit) {
      this.fashionService.update(this.id, this.fashion).subscribe(() => {
        this.router.navigate(['/list']);
      });
    } else {
      this.fashionService.add(this.fashion).subscribe(() => {
        this.router.navigate(['/list']);
      });
    }
  }
}
