const headers = document.querySelectorAll(".accordion-header");

headers.forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const isOpen = header.getAttribute("aria-expanded") === "true";

    header.setAttribute("aria-expanded", String(!isOpen));
    content.hidden = isOpen;
  });
});
