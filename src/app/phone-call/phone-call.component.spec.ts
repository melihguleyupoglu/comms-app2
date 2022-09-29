import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCallComponent } from './phone-call.component';

describe('PhoneCallComponent', () => {
  let component: PhoneCallComponent;
  let fixture: ComponentFixture<PhoneCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneCallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
