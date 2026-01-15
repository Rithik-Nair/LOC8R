document.addEventListener('DOMContentLoaded', function () {
  const liveLocationBtn = document.getElementById('liveLocationBtn');

  if (!liveLocationBtn) {
    console.warn('liveLocationBtn not found');
    return;
  }

  liveLocationBtn.addEventListener('click', function () {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    liveLocationBtn.disabled = true;
    liveLocationBtn.textContent = 'Getting Location...';

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('Location obtained:', lat, lng);
        // Redirect with coordinates
        window.location.href = `/locations?lat=${lat}&lng=${lng}`;
      },
      function (error) {
        liveLocationBtn.disabled = false;
        liveLocationBtn.textContent = 'Enable Live Location';
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please enable location permissions and try again.');
      }
    );
  });
});
