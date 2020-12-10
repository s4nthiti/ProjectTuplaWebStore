import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherRegisterComponent } from './publisher-register.component';

describe('PublisherRegisterComponent', () => {
  let component: PublisherRegisterComponent;
  let fixture: ComponentFixture<PublisherRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublisherRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
