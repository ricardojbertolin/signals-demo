import { Component, input } from '@angular/core';
import { LightColor } from '../../app.definitions';

@Component({
    selector: 'app-traffic-light',
    imports: [],
    templateUrl: './traffic-light.component.html',
    styleUrl: '../shared/light-styles.scss',
    host: { class: 'flex-column-centered' }
})
export class TrafficLightComponent {
    lightColor = input(LightColor.Red);
    readonly LightColor = LightColor;
}
