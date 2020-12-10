import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPublisherComponent } from './verify-publisher.component';

describe('VerifyPublisherComponent', () => {
  let component: VerifyPublisherComponent;
  let fixture: ComponentFixture<VerifyPublisherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyPublisherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
