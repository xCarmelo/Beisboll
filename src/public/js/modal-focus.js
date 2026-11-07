const modalTriggers = new WeakMap();

// Recordar el botón que abrió el modal.
document.addEventListener('show.bs.modal', (event) => {
    const modal = event.target;
    if (!(modal instanceof HTMLElement) || !modal.matches('.modal')) return;

    const trigger = event.relatedTarget || document.activeElement;

    if (trigger instanceof HTMLElement && !modal.contains(trigger)) {
        modalTriggers.set(modal, trigger);
    }
});

// Liberar el foco antes de ocultar el modal.
document.addEventListener('hide.bs.modal', (event) => {
    const modal = event.target;
    if (!(modal instanceof HTMLElement) || !modal.matches('.modal')) return;

    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement && modal.contains(activeElement)) {
        activeElement.blur();
    }
});

// Devolver el foco cuando el modal terminó de cerrarse.
document.addEventListener('hidden.bs.modal', (event) => {
    const modal = event.target;
    if (!(modal instanceof HTMLElement) || !modal.matches('.modal')) return;

    const trigger = modalTriggers.get(modal);
    modalTriggers.delete(modal);

    if (trigger?.isConnected && !trigger.matches(':disabled')) {
        trigger.focus({ preventScroll: true });
        return;
    }

    const fallback = document.getElementById('main-content');
    fallback?.focus({ preventScroll: true });
});