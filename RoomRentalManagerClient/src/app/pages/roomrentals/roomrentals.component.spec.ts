import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomrentalsComponent } from './roomrentals.component';

describe('RoomrentalsComponent', () => {
  let component: RoomrentalsComponent;
  let fixture: ComponentFixture<RoomrentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomrentalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomrentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
