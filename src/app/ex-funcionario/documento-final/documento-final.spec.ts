import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoFinal } from './documento-final';

describe('DocumentoFinal', () => {
  let component: DocumentoFinal;
  let fixture: ComponentFixture<DocumentoFinal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentoFinal],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentoFinal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
