import { onMounted, onUnmounted, ref } from "vue";

const useMasonry = () => {
  const masonryContainer = ref(null);
  const items = ref([]);

  onMounted(() => {
    if (masonryContainer.value) {
      const masonryItem = Array.from(masonryContainer.value.children);
      items.value = masonryItem;
    }
  });

  onMounted(() => {
    const handleMasonry = () => {
      if (!items.value || items.value.length < 1) return;
      let gapSize = 0;
      if (masonryContainer.value) {
        gapSize = parseInt(
          window
            .getComputedStyle(masonryContainer.value)
            .getPropertyValue("grid-row-gap"),
        );
      }
      items.value.forEach((el) => {
        let previous = el.previousSibling;
        while (previous) {
          if (previous.nodeType === 1) {
            el.style.marginTop = "0";
            if (
              previous instanceof HTMLElement &&
              elementLeft(previous) === elementLeft(el)
            ) {
              el.style.marginTop = `${-(elementTop(el) - elementBottom(previous) - gapSize)}px`;
              break;
            }
          }
          previous = previous.previousSibling;
        }
      });
    };

    handleMasonry();
    window.addEventListener("resize", handleMasonry);

    onUnmounted(() => {
      window.removeEventListener("resize", handleMasonry);
    });
  });

  const elementLeft = (el) => {
    return el.getBoundingClientRect().left;
  };

  const elementTop = (el) => {
    return el.getBoundingClientRect().top + window.scrollY;
  };

  const elementBottom = (el) => {
    return el.getBoundingClientRect().bottom + window.scrollY;
  };

  return masonryContainer;
};

export default useMasonry;
