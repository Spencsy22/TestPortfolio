function toggleProjectCard(card) {
    const button = card.querySelector('.project-card-toggle');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Keep focus on a visible control when collapsing content.
    if (isExpanded) {
        button.focus({ preventScroll: true });
    }

    button.setAttribute('aria-expanded', String(!isExpanded));
    card.querySelectorAll('.project-card-detail').forEach((detail) => {
        detail.hidden = isExpanded;
    });
    card.classList.toggle('is-collapsed', isExpanded);
    button.querySelector('.project-card-indicator').textContent = isExpanded ? '+' : '−';
}

document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', (event) => {
        // Let links and other controls inside future cards keep their own behavior.
        const control = event.target.closest('a, button, input, textarea, select, label');
        if (control && !control.matches('.project-card-toggle')) {
            return;
        }

        // Native button clicks also cover Enter and Space keyboard activation.
        toggleProjectCard(card);
    });
});

function validateContactField(field) {
    const requiredMessages = {
        name: 'Please enter your name.',
        email: 'Please enter your email address.',
        message: 'Please enter a message.'
    };
    let message = '';

    if (!field.value.trim()) {
        message = requiredMessages[field.name];
    } else if (field.validity.typeMismatch) {
        message = 'Please enter a valid email address, such as name@example.com.';
    }

    const error = document.getElementById(`${field.id}-error`);
    error.textContent = message;
    error.hidden = !message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
}

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const fields = Array.from(contactForm.querySelectorAll('input, textarea'));
    const summary = document.getElementById('form-errors');

    // Use inline feedback when JavaScript runs; otherwise native validation remains.
    contactForm.noValidate = true;

    fields.forEach((field) => {
        field.addEventListener('blur', () => validateContactField(field));
        field.addEventListener('input', () => {
            summary.textContent = '';
            if (field.getAttribute('aria-invalid') === 'true') {
                validateContactField(field);
            }
        });
    });

    contactForm.addEventListener('submit', (event) => {
        const invalidFields = fields.filter((field) => !validateContactField(field));

        if (invalidFields.length) {
            event.preventDefault();
            summary.textContent = 'Please correct the highlighted fields before submitting.';
            invalidFields[0].focus();
        } else {
            summary.textContent = '';
            // Valid entries continue to the form's existing submission endpoint.
        }
    });
}
