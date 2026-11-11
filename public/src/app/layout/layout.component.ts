import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/** Authenticated app shell: sidebar + main content area. */
@Component({
  selector: 'app-layout',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  readonly sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}

