import { LightColor } from '../../app.definitions';

export const getRequestsText = (pedestrianRequest: boolean, pedestrianRequestStarted: boolean) =>
    (pedestrianRequest && !pedestrianRequestStarted) ? 'Pedestrian green light requested' : '';

export const getStatusText = (pedestrianRequestStarted: boolean) =>
    pedestrianRequestStarted ? 'Pedestrian light is green' : 'Controller light';

export const getPedestrianLightColor = (pedestrianRequestStarted: boolean) =>
    pedestrianRequestStarted ? LightColor.Green : LightColor.Red;

export const getTrafficLightColor = (pedestrianRequestStarted: boolean, lightColorCycle: LightColor) =>
    pedestrianRequestStarted ? LightColor.Red : lightColorCycle;

export const pedestrianStageShouldBeStarted = (pedestrianRequestStarted: boolean, pedestrianRequest: boolean, lightColorCycle: LightColor) =>
    !pedestrianRequestStarted && pedestrianRequest && lightColorCycle === LightColor.Red;
