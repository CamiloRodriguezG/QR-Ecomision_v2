function includeHTML(id, url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      const footerLogo = document.querySelector(".footer-logo");

      if (footerLogo) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                footerLogo.classList.add("visible");
                observer.unobserve(footerLogo);
              }
            });
          },
          {
            threshold: 0.5,
          }
        );
        observer.observe(footerLogo);
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  includeHTML("header", "util/header.html");
  includeHTML("footer", "util/footer.html");
});
