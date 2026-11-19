import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Budget } from '@app/core/models';
import { budgetUsagePercent, isBudgetNearLimit } from '@app/core/utils/budget.utils';

@Component({
  selector: 'app-budget-bar',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './budget-bar.component.html',
})
export class BudgetBarComponent {
  @Input({ required: true }) budget!: Budget;

  /** Usage percentage, uncapped (used for labels). */
  get usage(): number {
    return budgetUsagePercent(this.budget);
  }

  /** Bar fill width, capped at 100%. */
  get fill(): number {
    return Math.min(this.usage, 100);
  }

  get isWarning(): boolean {
    return isBudgetNearLimit(this.budget);
  }
}

