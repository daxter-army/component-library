import { useEffect, useCallback } from "react";

function useOutsideClick(ref: any, handler: () => void) {
	const refPresenceHandler = useCallback((event: MouseEvent) => {
		let isRefThere = false

		for (let i = 0; i < ref.current.length; i++) {
			if (!ref.current[i].current) continue

			// Comparing nodes, whether the clicked node is equal to a ref, or is a children of the ref
			if ((ref.current[i].current.isEqualNode(event.target)) || (ref.current[i].current.contains(event.target))) {
				isRefThere = true
				break
			}
		}

		return isRefThere
	}, [ref])

	const clickHandler = useCallback((event: MouseEvent) => {
		if (!ref.current) return;
		if (!refPresenceHandler(event)) handler()

	}, [handler, ref, refPresenceHandler])

	useEffect(
		() => {
			document.addEventListener("click", clickHandler);

			return () => {
				document.removeEventListener("click", clickHandler);
			};
		}, [ref, handler, clickHandler]
	);
}

export default useOutsideClick