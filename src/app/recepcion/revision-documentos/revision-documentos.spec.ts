import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionDocumentos } from './revision-documentos';

describe('RevisionDocumentos', () => {
  let component: RevisionDocumentos;
  let fixture: ComponentFixture<RevisionDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisionDocumentos],
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionDocumentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
