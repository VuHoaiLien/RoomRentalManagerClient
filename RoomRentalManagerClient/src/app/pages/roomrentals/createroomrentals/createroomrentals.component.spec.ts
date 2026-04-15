import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomRentalsComponent } from './createroomrentals.component';

describe('CreateRoomRentalsComponent', () => {
  let component: CreateRoomRentalsComponent;
  let fixture: ComponentFixture<CreateRoomRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRoomRentalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRoomRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
