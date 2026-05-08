export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
	timeout?: number;
}

class UIState {
	toasts = $state<Toast[]>([]);

	addToast(message: string, type: 'success' | 'error' | 'info' = 'info', timeout = 3000) {
		const id = Math.random().toString(36).substring(2, 9);
		const toast: Toast = { id, message, type, timeout };
		this.toasts = [...this.toasts, toast];

		if (timeout > 0) {
			setTimeout(() => {
				this.removeToast(id);
			}, timeout);
		}
	}

	removeToast(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}
}

export const ui = new UIState();
