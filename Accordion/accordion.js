const headers = document.querySelectorAll(".accordion-header");

headers.forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.closest(".accordion-item");
    const content = item?.querySelector(".accordion-content");
    const isOpen = header.getAttribute("aria-expanded") === "true";

    headers.forEach((otherHeader) => {
      const otherItem = otherHeader.closest(".accordion-item");
      const otherContent = otherItem?.querySelector(".accordion-content");

      otherHeader.setAttribute("aria-expanded", "false");
      if (otherContent) {
        otherContent.hidden = true;
      }
    });

    const nextState = !isOpen;
    header.setAttribute("aria-expanded", String(nextState));
    if (content) {
      content.hidden = !nextState;
    }
  });
});
