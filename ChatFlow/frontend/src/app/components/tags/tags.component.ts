import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagService } from '../../services/tag.service';
import { CustomerService } from '../../services/customer.service';

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  customerCount?: number;
}

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Tags ({{ tags.length }})</h5>
        <button class="btn btn-primary btn-sm" (click)="showCreateModal = true">
          + New Tag
        </button>
      </div>
      
      <div class="card-body">
        <div class="row">
          <div class="col-md-4" *ngFor="let tag of tags">
            <div class="tag-card p-3 border rounded mb-3" 
                 [style.border-left-color]="tag.color">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="mb-1" [style.color]="tag.color">{{ tag.name }}</h6>
                <span class="badge bg-secondary">{{ tag.customerCount }}</span>
              </div>
              <small class="text-muted">{{ tag.description }}</small>
              <div class="mt-2">
                <button class="btn btn-sm btn-outline-primary me-1" 
                        (click)="editTag(tag)">
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" 
                        (click)="deleteTag(tag.id)"
                        [disabled]="tag.customerCount! > 0">
                  {{ tag.customerCount! > 0 ? 'In Use' : 'Delete' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>{{ editingTag ? 'Edit' : 'Create' }} Tag</h5>
            <button class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input class="form-control" [(ngModel)]="currentTag.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Color</label>
              <input type="color" class="form-control form-control-color" 
                     [(ngModel)]="currentTag.color">
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" rows="2" 
                        [(ngModel)]="currentTag.description"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveTag()">
              {{ editingTag ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tag-card {
      transition: all 0.2s;
      cursor: pointer;
    }
    .tag-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class TagsComponent implements OnInit {
  tags: Tag[] = [];
  showModal = false;
  showCreateModal = false;
  editingTag: Tag | null = null;
  currentTag: Tag = { id: '', name: '', color: '#64748B' };

  constructor(
    private tagService: TagService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.tagService.getAll().subscribe({
      next: (response) => this.tags = response.data,
      error: (err) => console.error('Failed to load tags', err)
    });
  }

  editTag(tag: Tag) {
    this.editingTag = tag;
    this.currentTag = { ...tag };
    this.showModal = true;
  }

  deleteTag(tagId: string) {
    if (confirm('Are you sure? This cannot be undone.')) {
      this.tagService.delete(tagId).subscribe({
        next: () => this.loadTags(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  saveTag() {
    if (this.editingTag) {
      this.tagService.update(this.editingTag.id, this.currentTag).subscribe({
        next: () => {
          this.loadTags();
          this.closeModal();
        }
      });
    } else {
      this.tagService.create(this.currentTag).subscribe({
        next: (response) => {
          this.tags.push(response.data);
          this.closeModal();
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingTag = null;
    this.currentTag = { id: '', name: '', color: '#64748B' };
  }
}