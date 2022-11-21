export const scrollIntoView = (ref) => {
  if (ref?.current) {
    const offsetBottom = ref.current.offsetTop + ref.current.offsetHeight;
    window.scrollTo({ top: offsetBottom });
  }
  //ref.current.scrollIntoView({ behavior: "smooth" });
};
