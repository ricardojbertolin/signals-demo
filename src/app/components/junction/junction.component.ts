import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { lastValueFrom, Subscription, takeWhile } from 'rxjs';
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

    lightColorCycle = input<LightColor | null>();
    pedestrianRequest = input<boolean | null>();
    lightColorForced = input<LightColor | null>();

    // template bound vars
    requestsText = computed(() => {
        const pedestrianRequestAccepted = this.pedestrianRequest() && !this.lightColorForced() && !this.pedestrianRequestStarted$();
        return pedestrianRequestAccepted ? 'Pedestrian cycle requested' : '';
    });
    statusText = computed(() => {
        return this.lightColorForced()
            ? `Color forced for a cycle is ${ this.lightColorForced() }`
            : this.pedestrianRequestStarted$()
                ? 'Attending pedestrian request for 1 cycle'
                : `Controller light color is ${ this.lightColorCycle() }`;

    });

    pedestrianLightColor = computed(() =>
        this.pedestrianRequestStarted$() ? LightColor.Green : LightColor.Red
    );

    trafficLightColor = computed(() => {
        return this.lightColorForced()
            ?? (this.pedestrianRequestStarted$()
                ? LightColor.Red
                : this.lightColorCycle()!);
    });

    // signals for managing state
    private readonly pedestrianRequestStarted$ = signal(false);
    // others
    private readonly junctionControllerService = inject(JunctionControllerService);
    private lightColorCycle$ = toObservable(this.lightColorCycle);
    private subscription: Subscription | undefined;

    constructor() {
        effect(() => this.stopForcedColorStageAfterStarted());
        effect(() => this.startPedestrianStageWhenRequested());
        effect(() => this.stopPedestrianStageAfterCycle());
    }

    private async stopForcedColorStageAfterStarted() {
        if (this.lightColorForced()) {
            this.subscription?.unsubscribe();
            this.subscription = this.startCycleSubscription()
                                    .subscribe({
                                        complete: () => this.junctionControllerService.resetForceLightColor()
                                    });
        }
    }

    private startPedestrianStageWhenRequested() {
        if (!this.lightColorForced() && !this.pedestrianRequestStarted$() && this.pedestrianRequest() && this.lightColorCycle() === LightColor.Red) {
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
