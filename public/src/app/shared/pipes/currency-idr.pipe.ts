import { Pipe, PipeTransform } from '@angular/core';

const IDR_FORMAT = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** Formats a number as Indonesian Rupiah: 3970000 → "Rp 3.970.000". */
@Pipe({ name: 'currencyIdr', standalone: false })
export class CurrencyIdrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '—';
    }
    return `Rp ${IDR_FORMAT.format(value)}`;
  }
}

