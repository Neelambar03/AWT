function updateDateTime() {
    let now = new Date();

    // Date
    let dateStr = now.toDateString();

    // Time formatting
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    let timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Greeting
    let greeting = "";
    if (now.getHours() < 12) greeting = "🌞 Good Morning!";
    else if (now.getHours() < 18) greeting = "🌤️ Good Afternoon!";
    else if (now.getHours() < 21) greeting = "🌆 Good Evening!";
    else greeting = "🌙 Good Night!";

    // Inject into HTML
    document.getElementById("datetime").innerHTML =
        `${dateStr} | ${timeStr}<br><span>${greeting}</span>`;
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();
