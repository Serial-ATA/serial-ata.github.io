document.addEventListener('DOMContentLoaded', () => {
    const licenseFlyout = document.querySelector('.license-flyout');
    const licenseToggle = document.getElementById('license-toggle');

    if (licenseToggle && licenseFlyout) {
        licenseToggle.addEventListener('click', () => {
            licenseFlyout.classList.toggle('is-open');
        });

        document.addEventListener('click', (event) => {
            if (!licenseFlyout.contains(event.target) && licenseFlyout.classList.contains('is-open')) {
                licenseFlyout.classList.remove('is-open');
            }
        });
    }
});
