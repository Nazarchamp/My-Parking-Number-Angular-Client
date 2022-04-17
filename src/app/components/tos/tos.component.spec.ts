import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TOSComponent } from './tos.component';

describe('TOSComponent', () => {
  let component: TOSComponent;
  let fixture: ComponentFixture<TOSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TOSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
