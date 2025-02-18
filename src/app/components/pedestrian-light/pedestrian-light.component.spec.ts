import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedestrianLightComponent } from './pedestrian-light.component';

describe('PedestrianLightControllerComponent', () => {
    let component: PedestrianLightComponent;
    let fixture: ComponentFixture<PedestrianLightComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PedestrianLightComponent]
        })
                     .compileComponents();

        fixture = TestBed.createComponent(PedestrianLightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
