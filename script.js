document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '12px 0';
        } else {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '16px 0';
        }
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Forms prevent default
    document.getElementById('hero-booking-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Open modal with default option
        openModal('Economy Hatchback', 65);
    });

    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        const subject = encodeURIComponent(`Inquiry ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        
        // Open the user's default email client
        window.location.href = `mailto:albyrentals@gmail.com?subject=${subject}&body=${body}`;

        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Opening Email Client...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerText = 'Message Prepared!';
            btn.style.backgroundColor = '#10b981';
            e.target.reset();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Booking Modal Logic
    const modal = document.getElementById('booking-modal');
    const closeBtns = document.querySelectorAll('.close-btn, .close-modal-btn');
    const openBtns = document.querySelectorAll('.open-booking');
    
    // Steps
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    // Info elements
    const modalCarName = document.getElementById('modal-car-name');
    const summaryRate = document.getElementById('summary-rate');
    const summaryTotal = document.getElementById('summary-total');
    const payBtnAmount = document.getElementById('pay-btn-amount');
    
    let currentPrice = 0;

    function openModal(carName, price) {
        modalCarName.innerText = carName;
        currentPrice = parseInt(price);
        summaryRate.innerText = `$${currentPrice}.00`;
        summaryTotal.innerText = `$${currentPrice * 3}.00`; // Mock 3 days
        payBtnAmount.innerText = `$${currentPrice * 3}.00`;
        
        // Reset steps
        step1.classList.add('active');
        step2.classList.remove('active');
        step3.classList.remove('active');
        
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            document.getElementById('modal-booking-form').reset();
        }, 300);
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const carName = btn.getAttribute('data-car');
            const price = btn.getAttribute('data-price');
            openModal(carName, price);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Modal Form Submission -> Go to Step 2
    document.getElementById('modal-booking-form').addEventListener('submit', (e) => {
        e.preventDefault();
        step1.classList.remove('active');
        step2.classList.add('active');
    });

    // Back to Step 1
    document.getElementById('back-to-details').addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
    });

    // Pay Now -> Go to Step 3
    document.getElementById('pay-now-btn').addEventListener('click', () => {
        const btn = document.getElementById('pay-now-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            step2.classList.remove('active');
            step3.classList.add('active');
        }, 1500);
    });
});
// Wait for the webpage to fully load before attaching the button handler
document.addEventListener('DOMContentLoaded', function() {
    
    // Find the "Book Now" button on your page
    // Replace 'book-now-button' with whatever ID your button actually has
    const bookButton = document.querySelector('#book-now-button');
    
    // If the button exists, attach a function to run when clicked
    if (bookButton) {
        bookButton.addEventListener('click', handleBooking);
    }
    
});

// This function runs when someone clicks "Book Now"
async function handleBooking() {
    
    // Get data from your booking form fields
    // IMPORTANT: Change these IDs to match your actual HTML input IDs
    const name = document.querySelector('#customer-name')?.value;
    const email = document.querySelector('#customer-email')?.value;
    const date = document.querySelector('#booking-date')?.value;
    
    // Basic check to make sure required fields aren't empty
    if (!name || !date) {
        alert('Please fill in your name and booking date');
        return;
    }
    
    // Send the booking to your Supabase database
    const { data, error } = await supabase
        .from('bookings')
        .insert([{ 
            customer_name: name, 
            customer_email: email,
            booking_date: date,
            created_at: new Date()
        }]);
    
    // Show success or error message
    if (error) {
        console.error('Error:', error);
        alert('Booking failed. Please try again.');
    } else {
        alert('Booking sent! We will confirm via email.');
        // Optional: Clear the form fields here
    }
}
