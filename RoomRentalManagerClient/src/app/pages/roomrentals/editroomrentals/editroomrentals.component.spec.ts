import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomRentalsComponent } from './editroomrentals.component';

describe('EditroomrentalsComponent', () => {
  let component: EditRoomRentalsComponent;
  let fixture: ComponentFixture<EditRoomRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRoomRentalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRoomRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
