import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, lastValueFrom, Subscription, takeWhile } from 'rxjs';
import { CYCLE_NUM, LightColor } from '../../app.definitions';
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
        this.controllerLightColorInput$.next(controllerLightColor);
    }

    @Input() set pedestrianRequest(request: boolean) {
        this.pedestrianRequestInput$.next(request);
    }

    // template bound vars
    requestsText = '';
    statusText = '';
    trafficLightColor: LightColor = LightColor.Red;
    pedestrianLightColor: LightColor = LightColor.Red;
    // subjects for @inputs
    readonly controllerLightColorInput$ = new BehaviorSubject(LightColor.Red);
    private readonly pedestrianRequestInput$ = new BehaviorSubject(false);
    // subjects for managing state
    private readonly pedestrianRequestStarted$ = new BehaviorSubject(false);
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
        combineLatest([this.pedestrianRequestInput$, this.controllerLightColorInput$])
            .pipe(
                filter(([pedestrianRequest, controllerLightColor]) => !!pedestrianRequest && controllerLightColor === LightColor.Red),
                takeUntilDestroyed())
            .subscribe(
                async () => {
                    this.pedestrianRequestStarted$.next(true);
                    // start cycle and clean on finish
                    await lastValueFrom(this.startCycleSubscription());
                    this.pedestrianRequestStarted$.next(false);
                    this.junctionControllerService.resetRequestPedestrianCycle();
                }
            );
    }

    private manageDataSubscription() {
        combineLatest([this.controllerLightColorInput$, this.pedestrianRequestStarted$, this.pedestrianRequestInput$])
            .pipe(takeUntilDestroyed())
            .subscribe(
                ([controllerLightColor, pedestrianRequestStarted, pedestrianRequest]) => {
                    if (pedestrianRequestStarted) {
                        this.trafficLightColor = LightColor.Red;
                        this.pedestrianLightColor = LightColor.Green;
                        this.statusText = 'Pedestrian light is green';
                        this.requestsText = '';
                    } else {
                        this.trafficLightColor = controllerLightColor;
                        this.pedestrianLightColor = LightColor.Red;
                        this.statusText = `Controller light`;
                        this.requestsText = pedestrianRequest ? 'Pedestrian green light requested' : '';
                    }
                    this.cd.markForCheck();
                }
            );
    }

    private startCycleSubscription() {
        return this.controllerLightColorInput$
                   .pipe(takeWhile((_, time) => time < CYCLE_NUM));
    }

}
