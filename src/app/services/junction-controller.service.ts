import { Injectable, signal } from '@angular/core';
import { map, timer } from 'rxjs';
import { CYCLE_NUM, LIGHT_TIME, LightColor } from '../app.definitions';

@Injectable()
export class JunctionControllerService {

    readonly pedestrianRequest$ = signal(false);
    readonly lightColorForced$ = signal<LightColor | null>(null);
    readonly lightColorCycle$ = timer(0, LIGHT_TIME)
        .pipe(
            map(num => Object.values(LightColor).at(num % CYCLE_NUM) as LightColor)
        );

    requestPedestrianCycle() {
        this.pedestrianRequest$.set(true);
    }

    forceLightColor(lightColor: LightColor) {
        this.lightColorForced$.set(lightColor);
    }

    resetRequestPedestrianCycle() {
        this.pedestrianRequest$.set(false);
    }

    resetForceLightColor() {
        this.lightColorForced$.set(null);
    }

}
