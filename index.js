document.getElementById('flightForm').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('rFrom').innerText = document.getElementById('from').value;
  document.getElementById('rTo').innerText = document.getElementById('to').value;
  document.getElementById('rDate').innerText = document.getElementById('date').value;
  document.getElementById('rClass').innerText = document.getElementById('class').value;
});

function goToSeats() {
  document.getElementById('seat-selection').classList.remove('hidden');
  generateSeats();
}

function generateSeats() {
  const seatContainer = document.getElementById('seats');
  seatContainer.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    let seat = document.createElement('div');
    seat.className = 'seat';
    seat.innerText = i;
    seat.addEventListener('click', function() {
      if (!seat.classList.contains('occupied')) {
        seat.classList.toggle('selected');
        updateSelectedSeats();
      }
    });
    seatContainer.appendChild(seat);
  }
}

function updateSelectedSeats() {
  let selected = document.querySelectorAll('.seat.selected');
  let seats = Array.from(selected).map(seat => seat.innerText);
  document.getElementById('selectedSeats').innerText = seats.length > 0
    ? `Selected Seats: ${seats.join(', ')}`
    : 'Selected Seats: None';
}

function confirmBooking() {
  let from = document.getElementById('from').value;
  let to = document.getElementById('to').value;
  let date = document.getElementById('date').value;
  let seatList = document.querySelectorAll('.seat.selected');
  let seatNumbers = Array.from(seatList).map(s => s.innerText).join(', ');

  document.getElementById('bookingDetails').innerText =
    `Flight booked from ${from} to ${to} on ${date}. Seats: ${seatNumbers}`;
  
  document.getElementById('confirmation').classList.remove('hidden');
}
