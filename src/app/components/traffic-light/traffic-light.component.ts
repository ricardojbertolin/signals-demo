import { Component, input } from '@angular/core';
import { LightColor } from '../../app.definitions';

@Component({
    selector: 'app-traffic-light',
    imports: [],
    templateUrl: './traffic-light.component.html',
    styleUrl: './traffic-light.component.scss'
})
export class TrafficLightComponent {
    lightColor = input(LightColor.Red);
    readonly LightColor = LightColor;
}
