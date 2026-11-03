/* Add a keyboard-accessible scrolling region only when a table needs one. */
(() => {
  function updateTables() {
    document.querySelectorAll('table').forEach((table, index) => {
      let region = table.parentElement;
      if (region.tagName !== 'DIV' || !/(auto|scroll)/.test(getComputedStyle(region).overflowX)) {
        if (table.scrollWidth <= table.clientWidth && table.getBoundingClientRect().width <= innerWidth - 24) return;
        const wrapper = document.createElement('div');
        table.before(wrapper); wrapper.append(table); region = wrapper;
      }
      region.classList.add('mct-scroll-region');
      const overflows = region.scrollWidth > region.clientWidth + 2;
      let hint = region.previousElementSibling;
      if (!hint?.classList.contains('mct-scroll-hint')) {
        hint = document.createElement('p'); hint.className = 'mct-scroll-hint';
        hint.id = 'table-scroll-hint-' + index;
        hint.textContent = 'More columns → Swipe sideways, or focus the table and use the arrow keys.';
        region.before(hint);
      }
      hint.hidden = !overflows;
      if (overflows) {
        region.tabIndex = 0; region.setAttribute('role', 'region');
        region.setAttribute('aria-label', table.caption?.textContent || 'Scrollable data table');
        region.setAttribute('aria-describedby', hint.id);
      } else {
        region.removeAttribute('tabindex'); region.removeAttribute('role');
        region.removeAttribute('aria-label'); region.removeAttribute('aria-describedby');
      }
    });
  }
  updateTables(); window.addEventListener('resize', updateTables);
})();
