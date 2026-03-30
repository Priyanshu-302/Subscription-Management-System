# SubManager — Subscription Tracking Dashboard

<div align="center">
  <h3>A visually stunning, production-grade frontend for tracking and managing digital subscriptions.</h3>
</div>

<br />

## 🚀 Features

- **Interactive 3D Hero Scene**: A custom React Three Fiber (`@react-three/fiber`) generated scene featuring subtly floating subscription cards (Netflix, Spotify, Figma, etc.) that react to your mouse movements.
- **Dynamic Framer Motion Interactions**: Premium scrolling parallax effects, 60fps page transitions, and micro-interactions natively built into all buttons and cards.
- **Glassmorphism Aesthetic**: Dark luxury tech design system with electric blue and purple neon highlights over a subtle grid background.
- **Secure Authentication Flow**: Fully functional Login/Register UI connected via robust `React Hook Form` and `Zod` validation schemas with real-time password strength indicators.
- **Predictive Dashboards**: (Stubbed components ready for API hooks) to visualize your monthly/yearly spend layout via Recharts.
- **Zero-Friction State Management**: Custom `Axios` interceptors intelligently passing `JWT`, `session-tokens`, and `reset-tokens` managed flawlessly by `Zustand`.

---

## 🛠 Tech Stack

- **Framework**: [React.js](https://react.dev/) via [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Rendering**: [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) / [Drei](https://github.com/pmndrs/drei)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) + [Axios](https://axios-http.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **UI Tooling**: [Lucide React](https://lucide.dev/) (Icons) + [React Hot Toast](https://react-hot-toast.com/) (Notifications)

---

## 💻 Getting Started

### Prerequisites

You will need `Node.js` installed on your machine.
Ensure you have the backend (typically running on `http://localhost:5000`) set up separately to process authentications and subscription CRUD operations smoothly.

### Installation

1. Clone the repository and navigate into the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 📁 Folder Structure

```
src/
├── api/                  # Axios interceptors and individual API service files
├── components/
│   ├── 3d/               # React Three Fiber local scenes (e.g. HeroScene)
│   ├── layout/           # Sidebar, Navbar, and Protected Route wrappers
│   └── ui/               # Reusable base elements (Button, Input, Card)
├── hooks/                # Custom React hooks (if any)
├── pages/                # Specific Route Views (Landing, Login, Dashboard, etc.)
├── router/               # Centralized React Router configuration
├── store/                # Zustand global stores (user auth, active subscriptions)
└── utils/                # Formatting helpers (Currency, Dates)
```

---

## 💡 Notes for Development

- **Icons**: You can easily swap SVG icons by importing from `lucide-react`. The app natively tailors their colors.
- **Scrollbar**: A custom scrollbar definition lies natively in `src/index.css` to override default webkit styles.
- **API Mocks**: If the backend is off, `axios.js` attempts will trigger a Network Error. To test UI states without an active backend, bypass `onSubmit`/`useEffect` API calls or inject a mock service worker!
