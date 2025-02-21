import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LightColor } from '../../app.definitions';

@Component({
    selector: 'app-pedestrian-light',
    imports: [],
    templateUrl: './pedestrian-light.component.html',
    styleUrl: '../shared/light-styles.scss',
    host: { class: 'flex-column-centered' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedestrianLightComponent {

    lightColor = input(LightColor.Red);
    readonly LightColor = LightColor;

}
