import { Injectable } from '@angular/core';
import { map, Subject, timer } from 'rxjs';
import { CYCLE_NUM, LIGHT_TIME, LightColor } from '../app.definitions';

@Injectable()
export class JunctionControllerService {

    readonly pedestrianRequest$ = new Subject<boolean>();
    readonly lightColorCycle$ = timer(0, LIGHT_TIME)
        .pipe(map(num => Object.values(LightColor).at(num % CYCLE_NUM) as LightColor));

    requestPedestrianCycle() {
        this.pedestrianRequest$.next(true);
    }

    resetRequestPedestrianCycle() {
        this.pedestrianRequest$.next(false);
    }

}
