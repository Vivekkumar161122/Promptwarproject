# VenueSync

VenueSync is a dynamic, real-time event synchronization dashboard meant for digital signage in large-scale sporting venues and modern cinema complexes. The system addresses challenges around crowd movement and waiting times by syncing event state (Upcoming, Playing, Intermission, Ended) directly to localized zones (like Food Courts or Washrooms) so patrons know exactly how much time they have to step away.

## Features

*   **Global Event State Management**: A centralized Control Panel to manage the timing and state of an ongoing event or movie.
*   **Targeted Digital Signage**:
    *   **Food Court**: Displays wait times, intermission schedules, and contextual promotional pushes (e.g. "Combo Offer during intermission").
    *   **Washroom Layout**: A minimalist zone displaying urgent states (e.g. "Hurry back, event resumes in 30 seconds").
*   **Premium Modern Design**: Built with a sleek dark mode, vibrant status-based glow effects, and visually engaging glassmorphism styling all constructed without the need for large CSS frameworks.
*   **Zero Dependencies**: Utilizing pure Vanilla HTML5, CSS3, and JavaScript logic to keep the application lightweight and robust.

## Project Structure

```
PromptWarProject/
│
├── README.md             <- This file
└── src/                  <- Source Code Directory
    ├── index.html        <- Main Dashboard Interface
    ├── css/
    │   └── style.css     <- Premium Glassmorphism styling and themes
    └── js/
        └── app.js        <- Central State Management and Time Dispatcher
```

## Getting Started

1. Navigate into the `src` directory.
2. Ensure you have a standard modern web browser.
3. Simply open `index.html` in your web browser. 

Alternatively, if you're running a local development environment, use any basic HTTP server (e.g., Python's `http.server`) inside the `src` folder to serve the static assets.

```bash
cd src
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

## Using the System

The main interface acts as a multi-dashboard viewer, where you can tab between the three system views:

1.  **Control Panel**: Simulate an administrator starting an event or calling an intermission.
2.  **Food Court Signage**: Observe how the data updates live for patrons. Notice how the custom promotional widgets display during specific active states.
3.  **Washroom Signage**: Watch how the system counts down in large formats to push patrons back to their seats.

