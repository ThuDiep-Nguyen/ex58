import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionService } from '../services/fashion.service';
import { Fashion } from '../models/fashion.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-fashion-detail',
  templateUrl: './fashion-detail.component.html',
  standalone: false,
})
export class FashionDetailComponent implements OnInit {
  fashion: Fashion = { title: '', details: '', thumbnail: '', style: '' };
  safeDetails: SafeHtml = '';

  constructor(
    private fashionService: FashionService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.fashionService.getById(id).subscribe(data => {
      this.fashion = data;
      this.safeDetails = this.sanitizer.bypassSecurityTrustHtml(data.details);
      this.cdr.detectChanges();
    });
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}
