import { LightColor } from '../../app.definitions';
import { getPedestrianLightColor, getRequestsText, getStatusText, getTrafficLightColor, pedestrianStageShouldBeStarted } from './junction.utils';

describe('getStatusText', () => {
    it('should return \'Pedestrian light is green\' when pedestrianRequestStarted is true', () => {
        expect(getStatusText(true)).toBe('Pedestrian light is green');
    });

    it('should return \'Controller light\' when pedestrianRequestStarted is false', () => {
        expect(getStatusText(false)).toBe('Controller light');
    });
});

describe('getRequestsText', () => {
    it('should return \'Pedestrian green light requested\' when pedestrianRequest is true and pedestrianRequestStarted is false', () => {
        expect(getRequestsText(true, false)).toBe('Pedestrian green light requested');
    });

    it('should return an empty string when pedestrianRequest is false', () => {
        expect(getRequestsText(false, false)).toBe('');
    });

    it('should return an empty string when pedestrianRequestStarted is true', () => {
        expect(getRequestsText(true, true)).toBe('');
    });

    it('should return an empty string when both pedestrianRequest and pedestrianRequestStarted are false', () => {
        expect(getRequestsText(false, false)).toBe('');
    });
});

describe('getPedestrianLightColor', () => {
    it('should return LightColor.Green when pedestrianRequestStarted is true', () => {
        expect(getPedestrianLightColor(true)).toBe(LightColor.Green);
    });

    it('should return LightColor.Red when pedestrianRequestStarted is false', () => {
        expect(getPedestrianLightColor(false)).toBe(LightColor.Red);
    });
});

describe('getTrafficLightColor', () => {
    it('should return LightColor.Red when pedestrianRequestStarted is true', () => {
        expect(getTrafficLightColor(true, LightColor.Green)).toBe(LightColor.Red);
    });

    it('should return the given controllerLightColor when pedestrianRequestStarted is false', () => {
        expect(getTrafficLightColor(false, LightColor.Green)).toBe(LightColor.Green);
        expect(getTrafficLightColor(false, LightColor.Yellow)).toBe(LightColor.Yellow);
        expect(getTrafficLightColor(false, LightColor.Red)).toBe(LightColor.Red);
    });
});

describe('pedestrianStageShouldBeStarted', () => {
    it('should return true when pedestrianRequestStarted is false, pedestrianRequest is true, and controllerLightColor is Red', () => {
        expect(pedestrianStageShouldBeStarted(false, true, LightColor.Red)).toBeTrue();
    });

    it('should return false when pedestrianRequestStarted is true', () => {
        expect(pedestrianStageShouldBeStarted(true, true, LightColor.Red)).toBeFalse();
    });

    it('should return false when pedestrianRequest is false', () => {
        expect(pedestrianStageShouldBeStarted(false, false, LightColor.Red)).toBeFalse();
    });

    it('should return false when controllerLightColor is not Red', () => {
        expect(pedestrianStageShouldBeStarted(false, true, LightColor.Green)).toBeFalse();
        expect(pedestrianStageShouldBeStarted(false, true, LightColor.Yellow)).toBeFalse();
    });

    it('should return false when all conditions are false', () => {
        expect(pedestrianStageShouldBeStarted(false, false, LightColor.Green)).toBeFalse();
    });
});
