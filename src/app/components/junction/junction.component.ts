import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { LightColor } from '../../app.definitions';
import { JunctionControllerService } from '../../services/junction-controller.service';
import { NotificationsAreaComponent } from '../notifications-area/notifications-area.component';
import { PedestrianLightComponent } from '../pedestrian-light/pedestrian-light.component';
import { PedestrianRequestComponent } from '../pedestrian-request/pedestrian-request.component';
import { TrafficLightComponent } from '../traffic-light/traffic-light.component';

@Component({
    selector: 'app-junction',
    imports: [
        PedestrianRequestComponent,
        PedestrianLightComponent,
        TrafficLightComponent,
        NotificationsAreaComponent
    ],
    templateUrl: './junction.component.html',
    styleUrl: './junction.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JunctionComponent {

    @Input() set lightColorCycle(colorCycle: LightColor | null) {
        this._lightColorCycle = colorCycle;
        if (this.pedestrianRequested && colorCycle === LightColor.Red) {
            if (!this.pedestrianRequestStarted) {
                this.pedestrianLightColor = LightColor.Green;
                this.pedestrianRequestStarted = true;
                this.requestsText = '';
                this.statusText = 'Pedestrian light is green';
            } else {
                this.pedestrianLightColor = LightColor.Red;
                this.pedestrianRequestStarted = false;
                this.pedestrianRequested = false;
                this.statusText = `Controller light`;
                this.junctionControllerService.resetRequestPedestrianCycle();
            }
            this.trafficLightColor = colorCycle!;

        } else if (!this.pedestrianRequestStarted) {
            this.trafficLightColor = colorCycle!;
            this.statusText = `Controller light`;
        }

    }

    get lightColorCycle() {
        return this._lightColorCycle;
    }

    @Input() set pedestrianRequest(request: boolean | null) {
        if (request && !this.pedestrianRequestStarted) {
            this.pedestrianRequested = true;
            this.requestsText = 'Pedestrian green light requested';
        } else if (request) {
            this.junctionControllerService.resetRequestPedestrianCycle();
        }
    }

    requestsText = '';
    statusText = '';
    trafficLightColor: LightColor = LightColor.Red;
    pedestrianLightColor: LightColor = LightColor.Red;
    private readonly junctionControllerService = inject(JunctionControllerService);
    private pedestrianRequested = false;
    private pedestrianRequestStarted = false;
    private _lightColorCycle: LightColor | null = null;

}
