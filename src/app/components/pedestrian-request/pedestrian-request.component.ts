import { Component, inject } from '@angular/core';
import { JunctionControllerService } from '../../services/junction-controller.service';

@Component({
    selector: 'app-pedestrian-request',
    templateUrl: './pedestrian-request.component.html',
    styleUrl: './pedestrian-request.component.scss'
})
export class PedestrianRequestComponent {

    private readonly junctionControllerService = inject(JunctionControllerService);

    requestPedestrianCycle() {
        this.junctionControllerService.requestPedestrianCycle();
    }
}
