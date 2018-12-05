import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStateComponent } from './api-state.component';

describe('ApiStateComponent', () => {
  let component: ApiStateComponent;
  let fixture: ComponentFixture<ApiStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiStateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
