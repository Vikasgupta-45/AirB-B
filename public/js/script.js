// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// Review form star rating and validation
document.addEventListener('DOMContentLoaded', function () {
  const stars = Array.from(document.querySelectorAll('.star'));
  const ratingInput = document.getElementById('ratingValue');
  const reviewBody = document.getElementById('reviewBody');
  const submitBtn = document.getElementById('submitReview');
  if (!stars.length || !ratingInput || !reviewBody || !submitBtn) return;

  function setRating(val) {
    ratingInput.value = val;
    stars.forEach(s => {
      s.classList.toggle('active', Number(s.dataset.value) <= Number(val));
    });
    validateForm();
  }

  stars.forEach(s => {
    s.addEventListener('click', () => setRating(s.dataset.value));
    s.addEventListener('mouseover', () => {
      const v = s.dataset.value;
      stars.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= Number(v)));
    });
    s.addEventListener('mouseout', () => {
      setRating(ratingInput.value);
    });
  });

  function validateForm(){
    const ratingOk = Number(ratingInput.value) > 0;
    const bodyOk = reviewBody.value.trim().length >= 1; // relaxed to make submit work reliably
    submitBtn.disabled = !(ratingOk && bodyOk);
  }

  reviewBody.addEventListener('input', validateForm);

  setRating(ratingInput.value || 0);
});


  const taxCheckbox = document.getElementById('flexSwitchCheckDefault');
  if (taxCheckbox) {
    taxCheckbox.addEventListener('click', function() {
      const taxInfoElements = document.getElementsByClassName('tax-info');
      for (let el of taxInfoElements) {
          el.style.display = taxCheckbox.checked ? 'inline' : 'none';
      }
    });
    
    taxCheckbox.addEventListener('click', function () {
      const priceRows = document.getElementsByClassName('price-row');
      for (let row of priceRows) {
          const basePrice = Number(row.dataset.base);
          const priceSpan = row.querySelector('.price-amount');
          const taxInfo = row.querySelector('.tax-info');
  
          if (taxCheckbox.checked) {
              const gstPrice = Math.round(basePrice * 1.18);
              priceSpan.textContent = gstPrice.toLocaleString('en-IN');
              if (taxInfo) taxInfo.style.display = 'inline';
          } else {
              priceSpan.textContent = basePrice.toLocaleString('en-IN');
              if (taxInfo) taxInfo.style.display = 'none';
          }
      }
    });
  }

// Highlight active filter on page load
document.addEventListener('DOMContentLoaded', function() {
    const selectedCategory = '<%= selectedCategory || "all" %>';
    const filterElements = document.querySelectorAll('.filter');
    filterElements.forEach(el => {
        if (el.dataset.category === selectedCategory) {
            el.classList.add('active');
        }
    });
});

// Filter listings by category
function filterListings(category) {
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.location.href = url.toString();
}



