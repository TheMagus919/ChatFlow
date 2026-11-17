
import { Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TagService } from '../../services/tag.service';
import { AuthService } from '../../services/auth.service';

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  customerCount?: number;
  user_id?: number | null;
  isDefault?: boolean;
}

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {

  tags: Tag[] = [];

  canManageTags = false;
  loading = false;
  saving = false;

  showModal = false;
  editingTag: Tag | null = null;

  successMessage = '';
  errorMessage = '';
  modalError = '';

  currentTag: Tag = this.emptyTag();

  private userSubscription?: Subscription;

  constructor(
    private tagService: TagService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.canManageTags =
        user?.subscription === 'pro' ||
        user?.subscription === 'business';
    });

    this.loadTags();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  get defaultTags(): Tag[] {
    return this.tags.filter(tag =>
      tag.isDefault === true || tag.user_id == null
    );
  }

  get customTags(): Tag[] {
    return this.tags.filter(tag =>
      tag.isDefault === false || tag.user_id != null
    );
  }

  private emptyTag(): Tag {
    return {
      id: '',
      name: '',
      color: '#6759ff',
      description: ''
    };
  }

  loadTags(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.tagService.getAll().subscribe({
      next: (response) => {
        this.tags = response?.data || [];
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading tags:', err);

        this.tags = [];
        this.loading = false;

        this.errorMessage =
          err.error?.error ||
          err.error?.message ||
          'No se pudieron cargar las etiquetas.';

        this.cdr.detectChanges();
      }
    });
  }

  openCreateModal(): void {
    if (!this.canManageTags) {
      return;
    }

    this.clearMessages();
    this.editingTag = null;
    this.currentTag = this.emptyTag();
    this.showModal = true;
  }

  editTag(tag: Tag): void {
    if (!this.canManageTags || tag.user_id == null) {
      return;
    }

    this.clearMessages();
    this.editingTag = tag;
    this.currentTag = { ...tag };
    this.showModal = true;
  }

  deleteTag(tag: Tag): void {
    if (!this.canManageTags || tag.user_id == null) {
      return;
    }

    if ((tag.customerCount || 0) > 0) {
      this.errorMessage =
        'No podés eliminar una etiqueta que está asignada a clientes.';
      return;
    }

    const confirmed = confirm(
      `¿Querés eliminar la etiqueta "${tag.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.tagService.delete(tag.id).subscribe({
      next: () => {
        this.successMessage = 'Etiqueta eliminada correctamente.';
        this.loadTags();
      },
      error: (err) => {
        console.error('Error deleting tag:', err);
        this.errorMessage =
          err.error?.error ||
          err.error?.message ||
          'No se pudo eliminar la etiqueta.';
      }
    });
  }

  saveTag(): void {
    const name = this.currentTag.name.trim();

    if (!name) {
      this.modalError = 'El nombre de la etiqueta es obligatorio.';
      return;
    }

    if (!this.canManageTags) {
      this.modalError =
        'Necesitás un plan Pro o Business para administrar etiquetas.';
      return;
    }

    const payload: Partial<Tag> = {
      name,
      color: this.currentTag.color,
      description: this.currentTag.description?.trim() || ''
    };

    this.saving = true;
    this.modalError = '';

    if (this.editingTag) {
      this.tagService.update(this.editingTag.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();

          this.successMessage = '¡Etiqueta actualizada correctamente!';

          this.loadTags();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.saving = false;

          this.modalError =
            err.error?.error ||
            err.error?.message ||
            'No se pudo actualizar la etiqueta.';

          this.cdr.detectChanges();
        }
      });
    } else {
      this.tagService.create(payload).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();

          this.successMessage = '¡Etiqueta creada correctamente!';

          this.loadTags();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.saving = false;

          this.modalError =
            err.error?.error ||
            err.error?.message ||
            'No se pudo crear la etiqueta.';

          this.cdr.detectChanges();
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingTag = null;
    this.currentTag = this.emptyTag();
    this.modalError = '';
    this.saving = false;
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
