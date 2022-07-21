import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileComparisonDialogComponent } from './file-comparison-dialog.component';

describe('FileComparisonDialogComponent', () => {
  let component: FileComparisonDialogComponent;
  let fixture: ComponentFixture<FileComparisonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileComparisonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileComparisonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
