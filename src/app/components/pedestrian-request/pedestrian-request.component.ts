import { Component, inject } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { JunctionControllerService } from '../../services/junction-controller.service';

@Component({
    selector: 'app-pedestrian-request',
    templateUrl: './pedestrian-request.component.html',
    imports: [
        MatIcon,
        MatMiniFabButton
    ],
    styleUrls: [
        '../shared/force-styles.scss'
    ],
    host: { class: 'flex-column-centered' }
})
export class PedestrianRequestComponent {

    readonly junctionControllerService = inject(JunctionControllerService);

    requestPedestrianCycle() {
        this.junctionControllerService.requestPedestrianCycle();
    }
}
