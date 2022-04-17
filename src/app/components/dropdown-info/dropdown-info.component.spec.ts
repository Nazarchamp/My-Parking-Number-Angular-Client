import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownInfoComponent } from './dropdown-info.component';

describe('DropdownInfoComponent', () => {
  let component: DropdownInfoComponent;
  let fixture: ComponentFixture<DropdownInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
