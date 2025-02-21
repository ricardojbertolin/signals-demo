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
    lightColorCycle = input<LightColor | null>();
    pedestrianRequest = input<boolean | null>();
    // template bound vars
    requestsText = computed(() => getRequestsText(this.pedestrianRequest()!, this.pedestrianRequestStarted$()));
    statusText = computed(() => getStatusText(this.pedestrianRequestStarted$()));
    pedestrianLightColor = computed(() => getPedestrianLightColor(this.pedestrianRequestStarted$()));
    trafficLightColor = computed(() => getTrafficLightColor(this.pedestrianRequestStarted$(), this.lightColorCycle()!));
    // signals for managing state
    private readonly pedestrianRequestStarted$ = signal(false);
    // others
    private readonly junctionControllerService = inject(JunctionControllerService);
    private lightColorCycle$ = toObservable(this.lightColorCycle);

    constructor() {
        effect(() => this.startPedestrianStageWhenRequested());
        effect(() => this.stopPedestrianStageAfterCycle());
    }

    private startPedestrianStageWhenRequested() {
        if (pedestrianStageShouldBeStarted(this.pedestrianRequestStarted$(), this.pedestrianRequest()!, this.lightColorCycle()!)) {
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
        return this.lightColorCycle$
                   .pipe(takeWhile((_, time) => time < CYCLE_NUM));

    }

}
