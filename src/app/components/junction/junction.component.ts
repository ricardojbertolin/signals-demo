import { Component, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, finalize, Subscription, takeWhile } from 'rxjs';
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
        this.lightColorCycleInput$.next(colorCycle);
    }

    @Input() set pedestrianRequest(request: boolean | null) {
        this.pedestrianRequestInput$.next(request);
    }

    @Input() set lightColorForced(color: LightColor | null) {
        this.lightColorForcedInput$.next(color);
    }

    // template bound vars
    requestsText = '';
    statusText = '';
    trafficLightColor: LightColor = LightColor.Red;
    pedestrianLightColor: LightColor = LightColor.Red;
    // subjects for @inputs
    readonly lightColorCycleInput$ = new BehaviorSubject<LightColor | null>(null);
    private readonly lightColorForcedInput$ = new BehaviorSubject<LightColor | null>(null);
    private readonly pedestrianRequestInput$ = new BehaviorSubject<boolean | null>(null);
    // subjects for managing state
    private readonly pedestrianRequestStarted$ = new BehaviorSubject<boolean | null>(null);
    private readonly lightColorForcedStarted$ = new BehaviorSubject<LightColor | null>(null);
    // others
    private cycleSubscription: Subscription | undefined;
    private readonly junctionControllerService = inject(JunctionControllerService);

    constructor() {
        this.setSubscriptions();
    }

    private setSubscriptions() {
        this.forceColorSubscription();
        this.pedestrianRequestSubscription();
        this.manageDataSubscription();
    }

    private forceColorSubscription() {
        this.lightColorForcedInput$
            .pipe(
                filter(Boolean),
                filter(color => color !== this.lightColorForcedStarted$.getValue()),
                takeUntilDestroyed(),
            )
            .subscribe(
                color => {
                    this.lightColorForcedStarted$.next(color);
                    // start cycle and clean on finish
                    this.startCycleSubscription(() => {
                        this.lightColorForcedStarted$.next(null);
                        this.junctionControllerService.resetForceLightColor();
                    });

                });
    }

    private pedestrianRequestSubscription() {
        combineLatest([this.pedestrianRequestInput$, this.lightColorCycleInput$])
            .pipe(
                filter(([pedestrianRequest, lightColorCycle]) => !this.lightColorForcedStarted$.getValue() && !!pedestrianRequest && lightColorCycle === LightColor.Red),
                takeUntilDestroyed())
            .subscribe(
                () => {
                    this.pedestrianRequestStarted$.next(true);
                    // start cycle and clean on finish
                    this.startCycleSubscription(() => {
                        this.pedestrianRequestStarted$.next(false);
                        this.junctionControllerService.resetRequestPedestrianCycle();
                    });
                }
            );
    }

    private manageDataSubscription() {
        combineLatest([this.lightColorForcedStarted$, this.lightColorCycleInput$, this.pedestrianRequestStarted$, this.pedestrianRequestInput$])
            .pipe(takeUntilDestroyed())
            .subscribe(
                ([lightColorBeingForced, lightColorCycle, pedestrianRequestStarted, pedestrianRequest]) => {
                    if (lightColorBeingForced) {
                        this.trafficLightColor = lightColorBeingForced;
                        this.pedestrianLightColor = LightColor.Red;
                        this.statusText = `Color forced for a cycle is ${ lightColorBeingForced }`;
                        this.requestsText = '';
                    } else if (pedestrianRequestStarted) {
                        this.trafficLightColor = LightColor.Red;
                        this.pedestrianLightColor = LightColor.Green;
                        this.statusText = 'Attending pedestrian request for 1 cycle';
                        this.requestsText = '';
                    } else {
                        this.trafficLightColor = lightColorCycle!;
                        this.pedestrianLightColor = LightColor.Red;
                        this.statusText = `Controller light color is ${ lightColorCycle }`;
                        this.requestsText = pedestrianRequest ? 'Pedestrian cycle requested' : '';
                    }
                }
            );
    }

    private startCycleSubscription(actionOnFinalize: () => void) {
        this.cycleSubscription?.unsubscribe();
        this.cycleSubscription = this.lightColorCycleInput$
                                     .pipe(
                                         takeWhile((_, time) => time < CYCLE_NUM),
                                         finalize(() => actionOnFinalize())
                                     )
                                     .subscribe();
    }

}
