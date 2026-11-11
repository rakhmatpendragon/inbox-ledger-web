import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Budget, BudgetDraft } from '@app/core/models';

export interface BudgetDialogData {
  budget?: Budget;
}

@Component({
  selector: 'app-budget-dialog',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budget-dialog.component.html',
})
export class BudgetDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<BudgetDialogComponent, BudgetDraft>>(MatDialogRef);
  readonly data = inject<BudgetDialogData | null>(MAT_DIALOG_DATA, { optional: true });

  readonly isEdit = Boolean(this.data?.budget);

  readonly form = this.fb.nonNullable.group({
    name: [this.data?.budget?.name ?? '', [Validators.required, Validators.maxLength(40)]],
    limit: [
      this.data?.budget?.limit ?? 1000000,
      [Validators.required, Validators.min(10000)],
    ],
    thresholdPercent: [
      Math.round((this.data?.budget?.alertThreshold ?? 0.9) * 100),
      [Validators.required, Validators.min(50), Validators.max(100)],
    ],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, limit, thresholdPercent } = this.form.getRawValue();
    this.dialogRef.close({
      name: name.trim(),
      limit: Number(limit),
      alertThreshold: thresholdPercent / 100,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

