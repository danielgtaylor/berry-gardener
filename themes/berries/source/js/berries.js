var overlay = document.querySelector('#overlay');
var overlayImage = document.querySelector('#overlay img');

overlay.addEventListener('click', function () {
  overlay.className = '';
});

[].forEach.call(
  document.querySelectorAll('.strip img'),
  function (img) {
    img.addEventListener('click', function () {
      overlayImage.onload = function () {
        console.log(overlayImage.clientWidth);
        overlayImage.style.top = (window.innerHeight / 2) - (overlayImage.clientHeight / 2) + 'px';
        overlayImage.style.left = (window.innerWidth / 2) - (overlayImage.clientWidth / 2) + 'px';
      };
      overlayImage.src = this.src;
      overlay.className = 'show';
    });
});
