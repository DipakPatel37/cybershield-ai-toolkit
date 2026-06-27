# 🛡️ CyberShield AI – Intelligent Cybersecurity Toolkit

## 📌 Project Overview

**CyberShield AI** is a futuristic, browser-based cybersecurity toolkit designed to provide essential security utilities in a fast, privacy-focused environment. Built with modern web technologies, it allows users to perform threat analysis, password strength testing, and secure file encryption entirely on the client-side. The project aims to empower users with accessible cybersecurity tools without requiring backend data transmission, ensuring maximum privacy and security.

## ✨ Features

* **Malware Detection** (Hash Scanning)
* **Phishing URL Detection**
* **Password Strength Checker**
* **File Encryption & Decryption** (AES)
* **Interactive Dashboard** (Live activity, stats, and threat distribution charts)
* **Scan History** (Locally stored recent activity log)
* **Responsive Design** (Works seamlessly across devices)
* **Dark Mode** (Futuristic cyberpunk aesthetic)

## 📸 Screenshots

### Home Page
> *[Add Home Page Screenshot Here]*

### Dashboard
> *[Add Dashboard Screenshot Here]*

### Malware Detection
> *[Add Malware Detection Screenshot Here]*

### Phishing Detection
> *[Add Phishing Detection Screenshot Here]*

### Password Checker
> *[Add Password Checker Screenshot Here]*

### Encryption Tool
> *[Add Encryption Tool Screenshot Here]*

## 🛠️ Tech Stack

* **React 19**
* **TypeScript**
* **TanStack Start & Router**
* **Vite**
* **Tailwind CSS v4**
* **Radix UI** (Accessible UI components)
* **Lucide React** (Icons)
* **Recharts** (Dashboard charts)
* **Zod** (Schema validation)
* **React Hook Form**

## 📂 Project Structure

```
cybershield-ai-toolkit/
├── .git/
├── .lovable/
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable Radix/Tailwind UI components
│   │   ├── AppShell.tsx      # Main application shell layout
│   │   ├── AppSidebar.tsx    # Navigation sidebar
│   │   ├── CyberBackground.tsx # Futuristic animated background
│   │   └── PageHeader.tsx    # Reusable page header component
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and stats management
│   ├── routes/
│   │   ├── __root.tsx        # Root route and layout
│   │   ├── index.tsx         # Home page
│   │   ├── dashboard.tsx     # Dashboard & analytics
│   │   ├── tools.encrypt.tsx # Encryption tool
│   │   ├── tools.malware.tsx # Malware detection tool
│   │   ├── tools.password.tsx # Password strength checker
│   │   ├── tools.phishing.tsx # Phishing URL detection
│   │   ├── about.tsx         # About page
│   │   └── contact.tsx       # Contact page
│   ├── routeTree.gen.ts      # Generated route tree
│   ├── router.tsx            # Router configuration
│   ├── server.ts             # Server entry point
│   ├── start.ts              # Client entry point
│   └── styles.css            # Global Tailwind and custom styles
├── bun.lock                  # Bun package lockfile
├── components.json           # UI component configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite bundler configuration
```

## ⚙️ Installation

To set up and run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/DipakPatel37/cybershield-ai-toolkit.git
   cd cybershield-ai-toolkit
   ```

2. **Install dependencies**
   Ensure you have [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) installed, then run:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📦 Requirements

* Node.js (v18 or higher recommended) or Bun
* Modern web browser (Chrome, Firefox, Safari, Edge)

Major dependencies include:
- `@tanstack/react-router`
- `@tanstack/react-start`
- `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/vite`
- `@radix-ui/react-*` components
- `recharts`
- `zod`, `react-hook-form`

## 🚀 Usage

* **Dashboard**: View your localized security activity, recent scans, and graphical threat distributions.
* **Malware Scanner**: Navigate to the Malware tool to scan file hashes against simulated threat databases.
* **Phishing Detection**: Use the Phishing tool to analyze suspicious URLs for common phishing patterns.
* **Password Checker**: Enter a password to see a real-time evaluation of its strength, entropy, and crack time estimation.
* **File Encryption**: Use the Encryption tool to securely encrypt or decrypt sensitive files using AES encryption algorithms in the browser.

## 🔒 Security Features

* **Client-Side Processing**: All encryption and password evaluations happen locally in the browser. No sensitive data is transmitted to a backend server.
* **Local Storage Logging**: History and dashboard statistics are stored locally in the browser's `localStorage` and can be cleared instantly.
* **AES Encryption**: Utilizes strong, industry-standard AES encryption for file protection.
* **Input Validation**: Uses Zod for strict input schema validation to prevent malformed data injection.

## 📁 Main Modules

* **`src/routes/dashboard.tsx`**: Manages the centralized command center, aggregating local stats and rendering Recharts data visualizations.
* **`src/routes/tools.*.tsx`**: Individual tool implementations. Each file encapsulates the logic, UI, and state for a specific security utility.
* **`src/lib/stats.ts`**: Handles the local storage management for dashboard metrics and recent history logs.
* **`src/components/ui/`**: Contains the foundational building blocks (buttons, inputs, cards) styled with Tailwind CSS to ensure a consistent, premium design language.

## 📈 Future Improvements

* Integrate real-world Threat Intelligence APIs (like VirusTotal) for actual malware hash lookups.
* Add a VPN connection diagnostic tool.
* Implement a secure password generator alongside the strength checker.
* Introduce an IP Address lookup and geolocation tool.
* Enhance the file encryption tool with chunked processing for very large files.

## 👨‍💻 Author

**Name:** Dipak Patel  
**Project Name:** CyberShield AI – Intelligent Cybersecurity Toolkit  
**Repository:** [https://github.com/DipakPatel37/cybershield-ai-toolkit](https://github.com/DipakPatel37/cybershield-ai-toolkit)

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
