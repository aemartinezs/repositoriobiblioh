/* BIBLIO H · Filtros y ordenamiento de la página de curso */
document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelector('[data-materials]');
  if (!list) return;

  const items      = Array.from(list.querySelectorAll('.material'));
  const checkboxes = Array.from(document.querySelectorAll('.filters input[type="checkbox"]'));
  const sortSelect = document.getElementById('ordenar');
  const counter    = document.querySelector('[data-results-count]');
  const empty      = document.querySelector('[data-empty]');
  const clearBtn   = document.querySelector('[data-clear-filters]');

  // 1. Contar cuántos materiales hay de cada tipo
  checkboxes.forEach(cb => {
    const total = items.filter(item => item.dataset.tipo === cb.value).length;
    const badge = cb.closest('label').querySelector('.filter__count');
    if (badge) badge.textContent = total;
    if (total === 0) cb.closest('.filter').classList.add('is-empty');
  });

  // 2. Filtrar según las casillas marcadas
  function applyFilters() {
    const active = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
    let visible = 0;

    items.forEach(item => {
      const show = active.length === 0 || active.includes(item.dataset.tipo);
      item.hidden = !show;
      if (show) visible++;
    });

    counter.innerHTML = `<strong>${visible}</strong> ${visible === 1 ? 'material' : 'materiales'}`;
    empty.hidden = visible !== 0;
    clearBtn.hidden = active.length === 0;
  }

  // 3. Ordenar (valor del select: "campo-direccion", p. ej. "ciclo-desc")
  function applySort() {
    const [key, dir] = sortSelect.value.split('-');
    const factor = dir === 'desc' ? -1 : 1;
    items
      .sort((a, b) => a.dataset[key].localeCompare(b.dataset[key], 'es', { numeric: true }) * factor)
      .forEach(item => list.appendChild(item));
  }

  checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  sortSelect.addEventListener('change', applySort);
  clearBtn.addEventListener('click', () => {
    checkboxes.forEach(cb => (cb.checked = false));
    applyFilters();
  });

  applySort();
  applyFilters();
});