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

    @Input() set controllerLightColor(controllerLightColor: LightColor) {
        this._controllerLightColor = controllerLightColor;
        if (this.pedestrianRequested && controllerLightColor === LightColor.Red) {
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
            this.trafficLightColor = controllerLightColor;

        } else if (!this.pedestrianRequestStarted) {
            this.trafficLightColor = controllerLightColor;
            this.statusText = `Controller light`;
        }

    }

    get controllerLightColor() {
        return this._controllerLightColor;
    }

    @Input() set pedestrianRequest(request: boolean) {
        if (request && !this.pedestrianRequestStarted) {
            this.pedestrianRequested = true;
            this.requestsText = 'Pedestrian green light requested';
        } else if (request) {
            this.junctionControllerService.resetRequestPedestrianCycle();
        }
    }

    // template bound vars
    requestsText = '';
    statusText = '';
    trafficLightColor: LightColor = LightColor.Red;
    pedestrianLightColor: LightColor = LightColor.Red;
    // vars for managing state
    private pedestrianRequested = false;
    private pedestrianRequestStarted = false;
    // others
    private _controllerLightColor: LightColor = LightColor.Red;
    private readonly junctionControllerService = inject(JunctionControllerService);
}
