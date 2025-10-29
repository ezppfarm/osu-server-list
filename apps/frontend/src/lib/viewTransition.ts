import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
import { navigationState } from './global';

export const setupViewTransitions = () => {
	beforeNavigate(async (nav) => {
		if (nav.type === 'link' && !nav.willUnload) {
			navigationState.set('loading');
		}
	});

	afterNavigate(() => {
		navigationState.set('loaded');
	});
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
};
