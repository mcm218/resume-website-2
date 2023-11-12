export class OnScrollValuePair <T> {
    initialMobileValue!: T;
	finalMobileValue!: T;

	initialDesktopValue!: T;
	finalDesktopValue!: T;

	constructor (initDesktop: T, finalDesktop: T, initMobile: T, finalMobile: T) {
		this.initialDesktopValue = initDesktop;
		this.finalDesktopValue = finalDesktop;
		this.initialMobileValue = initMobile;
		this.finalMobileValue = finalMobile;
	}
}