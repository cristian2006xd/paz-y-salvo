import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioArea } from './formulario-area';

describe('FormularioArea', () => {
  let component: FormularioArea;
  let fixture: ComponentFixture<FormularioArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioArea],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
