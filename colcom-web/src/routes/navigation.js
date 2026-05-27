export const navigate = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('colcom:navigate'));
  
  const hashIndex = path.indexOf('#');
  if (hashIndex !== -1) {
    const hash = path.substring(hashIndex);
    const scrollTarget = () => {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    // Try scrolling immediately
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If element not found, it might be rendering after navigation. Retry shortly.
      setTimeout(scrollTarget, 100);
    }
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
