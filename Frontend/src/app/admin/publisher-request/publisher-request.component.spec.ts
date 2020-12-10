import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherRequestComponent } from './publisher-request.component';

describe('PublisherRequestComponent', () => {
  let component: PublisherRequestComponent;
  let fixture: ComponentFixture<PublisherRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublisherRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
