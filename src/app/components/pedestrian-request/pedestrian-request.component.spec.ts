import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedestrianRequestComponent } from './pedestrian-request.component';

describe('PedestrianRequestComponent', () => {
    let component: PedestrianRequestComponent;
    let fixture: ComponentFixture<PedestrianRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PedestrianRequestComponent]
        })
                     .compileComponents();

        fixture = TestBed.createComponent(PedestrianRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
