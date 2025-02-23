import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { lastValueFrom, takeWhile } from 'rxjs';
import { CYCLE_NUM, LightColor } from '../../app.definitions';
import { JunctionControllerService } from '../../services/junction-controller.service';
import { NotificationsAreaComponent } from '../notifications-area/notifications-area.component';
import { PedestrianLightComponent } from '../pedestrian-light/pedestrian-light.component';
import { PedestrianRequestComponent } from '../pedestrian-request/pedestrian-request.component';
import { TrafficLightComponent } from '../traffic-light/traffic-light.component';
import { getPedestrianLightColor, getRequestsText, getStatusText, getTrafficLightColor, pedestrianStageShouldBeStarted } from './junction.utils';

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
    // inputs
    controllerLightColorInput$ = input(LightColor.Red);
    pedestrianRequestInput$ = input(false);
    // template bound vars
    requestsText = computed(() => getRequestsText(this.pedestrianRequestInput$(), this.pedestrianRequestStarted$()));
    statusText = computed(() => getStatusText(this.pedestrianRequestStarted$()));
    pedestrianLightColor = computed(() => getPedestrianLightColor(this.pedestrianRequestStarted$()));
    trafficLightColor = computed(() => getTrafficLightColor(this.pedestrianRequestStarted$(), this.controllerLightColorInput$()));
    // signals for managing state
    private readonly pedestrianRequestStarted$ = signal(false);
    // others
    private readonly junctionControllerService = inject(JunctionControllerService);
    private controllerLightColor$ = toObservable(this.controllerLightColorInput$);

    constructor() {
        effect(() => this.startPedestrianStageWhenRequested());
        effect(() => this.stopPedestrianStageAfterCycle());
    }

    private startPedestrianStageWhenRequested() {
        if (pedestrianStageShouldBeStarted(this.pedestrianRequestStarted$(), this.pedestrianRequestInput$(), this.controllerLightColorInput$())) {
            this.pedestrianRequestStarted$.set(true);
        }
    }

    private async stopPedestrianStageAfterCycle() {
        if (this.pedestrianRequestStarted$()) {
            await lastValueFrom(this.startCycleSubscription());
            this.junctionControllerService.resetRequestPedestrianCycle();
            this.pedestrianRequestStarted$.set(false);
        }
    }

    private startCycleSubscription() {
        return this.controllerLightColor$
                   .pipe(takeWhile((_, time) => time < CYCLE_NUM));

    }

}
