import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, finalize, Subscription, takeWhile } from 'rxjs';
import { CYCLE_NUM, LightColor } from '../../app.definitions';
import { JunctionControllerService } from '../../services/junction-controller.service';
import { PedestrianLightComponent } from '../pedestrian-light/pedestrian-light.component';
import { PedestrianRequestComponent } from '../pedestrian-request/pedestrian-request.component';
import { TrafficLightComponent } from '../traffic-light/traffic-light.component';

@Component({
    selector: 'app-junction',
    imports: [
        PedestrianRequestComponent,
        PedestrianLightComponent,
        TrafficLightComponent,
        TitleCasePipe
    ],
    templateUrl: './junction.component.html',
    styleUrl: './junction.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JunctionComponent {

    @Input() set lightColorCycle(colorCycle: LightColor | null) {
        this.lightColorCycleInput$.next(colorCycle);
    }

    @Input() set pedestrianRequest(request: boolean | null) {
        this.pedestrianRequestInput$.next(request);
    }

    // template bound vars
    requestsText = '';
    statusText = '';
    trafficLightColor: LightColor = LightColor.Red;
    pedestrianLightColor: LightColor = LightColor.Red;
    // subjects for @inputs
    readonly lightColorCycleInput$ = new BehaviorSubject<LightColor | null>(null);
    private readonly pedestrianRequestInput$ = new BehaviorSubject<boolean | null>(null);
    // subjects for managing state
    private readonly pedestrianRequestStarted$ = new BehaviorSubject<boolean | null>(null);
    // others
    private cycleSubscription: Subscription | undefined;
    private readonly junctionControllerService = inject(JunctionControllerService);
    private readonly cd = inject(ChangeDetectorRef);

    constructor() {
        this.setSubscriptions();
    }

    private setSubscriptions() {
        this.pedestrianRequestSubscription();
        this.manageDataSubscription();
    }

    private pedestrianRequestSubscription() {
        combineLatest([this.pedestrianRequestInput$, this.lightColorCycleInput$])
            .pipe(
                filter(([pedestrianRequest, lightColorCycle]) => !!pedestrianRequest && lightColorCycle === LightColor.Red),
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
        combineLatest([this.lightColorCycleInput$, this.pedestrianRequestStarted$, this.pedestrianRequestInput$])
            .pipe(takeUntilDestroyed())
            .subscribe(
                ([lightColorCycle, pedestrianRequestStarted, pedestrianRequest]) => {
                    if (pedestrianRequestStarted) {
                        this.trafficLightColor = LightColor.Red;
                        this.pedestrianLightColor = LightColor.Green;
                        this.statusText = 'Pedestrian light is green';
                        this.requestsText = '';
                    } else {
                        this.trafficLightColor = lightColorCycle!;
                        this.pedestrianLightColor = LightColor.Red;
                        this.statusText = `Controller light`;
                        this.requestsText = pedestrianRequest ? 'Pedestrian green light requested' : '';
                    }
                    this.cd.markForCheck();
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
