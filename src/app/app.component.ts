import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { JunctionComponent } from './components/junction/junction.component';
import { JunctionControllerService } from './services/junction-controller.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        JunctionComponent,
        AsyncPipe
    ],
    providers: [JunctionControllerService],
    styleUrl: './app.component.scss'
})
export class AppComponent {
    readonly junctionControllerService = inject(JunctionControllerService);
}
