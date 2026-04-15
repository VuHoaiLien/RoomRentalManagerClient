import { Directive, OnInit, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[dateTimePickerCustom]',
})
export class DateTimePickerCustomDirective implements OnInit {
  @Input('dateRangePickerFrom') fromDate!: Date | null;
  @Input('dateRangePickerTo') toDate!: Date | null;
  @HostListener('change',['$event.target.value'])
  onDateChange(value: string) {
    const selectedDate = new Date(value);
    if (this.fromDate && selectedDate < this.fromDate) {
      this.toDate = null;
    }
  }
  ngOnInit() {
    
  }
}