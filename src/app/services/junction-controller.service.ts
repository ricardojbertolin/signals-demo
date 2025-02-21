import { Injectable, signal } from '@angular/core';
import { map, timer } from 'rxjs';
import { CYCLE_NUM, LIGHT_TIME, LightColor } from '../app.definitions';

@Injectable()
export class JunctionControllerService {

    readonly pedestrianRequest$ = signal(false);
    readonly lightColorCycle$ = timer(0, LIGHT_TIME)
        .pipe(
            map(num => Object.values(LightColor).at(num % CYCLE_NUM) as LightColor)
        );

    requestPedestrianCycle() {
        this.pedestrianRequest$.set(true);
    }

    resetRequestPedestrianCycle() {
        this.pedestrianRequest$.set(false);
    }

}
