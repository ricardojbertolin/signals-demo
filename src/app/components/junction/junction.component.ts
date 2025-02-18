import { Component, inject, Input } from '@angular/core';
import { CYCLE_NUM, LightColor } from '../../app.definitions';
import { JunctionControllerService } from '../../services/junction-controller.service';
import { ForceSelectorComponent } from '../force-selector/force-selector.component';
import { PedestrianLightComponent } from '../pedestrian-light/pedestrian-light.component';
import { PedestrianRequestComponent } from '../pedestrian-request/pedestrian-request.component';
import { TrafficLightComponent } from '../traffic-light/traffic-light.component';

@Component({
    selector: 'app-junction',
    imports: [
        PedestrianRequestComponent,
        ForceSelectorComponent,
        PedestrianLightComponent,
        TrafficLightComponent
    ],
    templateUrl: './junction.component.html',
    styleUrl: './junction.component.scss'
})
export class JunctionComponent {

    @Input() set lightColorCycle(colorCycle: LightColor | null) {
        if (this.forcedColor) {
            if (this.forcedColorCycleTimes <= CYCLE_NUM) {
                this.forcedColorCycleTimes++;
            } else {
                this.forcedColor = undefined;
                this.trafficLightColor = colorCycle!;
                this.statusText = `Controller light color is ${ colorCycle }`;
                this.forcedColorCycleTimes = 0;
                this.junctionControllerService.resetForceLightColor();
            }

        } else if (this.pedestrianRequested && colorCycle === LightColor.Red) {
            if (!this.pedestrianRequestStarted) {
                this.pedestrianLightColor = LightColor.Green;
                this.pedestrianRequestStarted = true;
                this.requestsText = '';
                this.statusText = 'Attending pedestrian request for 1 cycle';
            } else {
                this.pedestrianLightColor = LightColor.Red;
                this.pedestrianRequestStarted = false;
                this.pedestrianRequested = false;
                this.statusText = `Controller light color is ${ colorCycle }`;
                this.junctionControllerService.resetRequestPedestrianCycle();
            }
            this.trafficLightColor = colorCycle!;

        } else if (!this.pedestrianRequestStarted) {
            this.trafficLightColor = colorCycle!;
            this.statusText = `Controller light color is ${ colorCycle }`;
        }

    }

    @Input() set pedestrianRequest(request: boolean | null) {
        if (request && !this.pedestrianRequestStarted && !this.forcedColor) {
            this.pedestrianRequested = true;
            this.requestsText = 'Pedestrian cycle requested';
        }
    }

    @Input() set lightColorForced(color: LightColor | null) {
        if (color && this.forcedColor !== color) {
            this.forcedColor = color;
            this.pedestrianLightColor = LightColor.Red;
            this.trafficLightColor = color;
            this.statusText = `Color forced for a cycle is ${ color }`;
            this.forcedColorCycleTimes = 0;
        }
    }

    requestsText = '';
    statusText = '';
    trafficLightColor: LightColor = LightColor.Red;
    pedestrianLightColor: LightColor = LightColor.Red;
    private readonly junctionControllerService = inject(JunctionControllerService);
    private pedestrianRequested = false;
    private pedestrianRequestStarted = false;
    private forcedColor: LightColor | undefined;
    private forcedColorCycleTimes = 0;

}
