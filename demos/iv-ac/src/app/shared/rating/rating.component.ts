import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {
  @Input() rating: number = 0;
  @Input() disabled: boolean = false;

  constructor() {}

  @HostBinding('style.opacity')
  get opacity(): number {
    return this.disabled ? 0.25 : 1;
  }

  onChange = (_rating: number) => {};

  onTouched = () => {};

  ratingClicked(rating: number): void {
    if (!this.disabled) {
      this.writeValue(rating);
    }
  }

  writeValue(rating: number): void {
    this.rating = rating;
    this.onChange(rating);
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
