export function scrollElementIntoView(id: string, containerId: string) {
	const container = document.getElementById(containerId);
	if (container) {
		const target = document.getElementById(id);
		if (!target) {
			container.scrollTo({ behavior: "smooth", top: 0 });
		}
		else if (target.getBoundingClientRect().bottom > container.getBoundingClientRect().bottom) {
			target.scrollIntoView({ behavior: 'smooth', block: "end" });
		}
		else if (target.getBoundingClientRect().top < container.getBoundingClientRect().top) {
			target.scrollIntoView({ behavior: 'smooth', block: "start" });
		}
	}
}