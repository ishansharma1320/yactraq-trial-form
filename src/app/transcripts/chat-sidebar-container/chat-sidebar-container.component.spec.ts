import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidebarContainerComponent } from './chat-sidebar-container.component';

describe('ChatSidebarContainerComponent', () => {
  let component: ChatSidebarContainerComponent;
  let fixture: ComponentFixture<ChatSidebarContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSidebarContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSidebarContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
