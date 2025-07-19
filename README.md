# FIT5032_2025_-3-_Wenhan-Li_35523212
Website for Elderly populations

---

# Elderly Health Management Platform

## Overview

The Elderly Health Management Platform is a modern web application built with Vue 3 and Element Plus. It is designed to help elderly users and their caregivers manage health information, participate in community activities, consult with professionals, and maintain personal health records. The project strictly follows the business requirements (BR) for the A2 stage of the FIT5032 course, with a strong focus on usability, security, and extensibility.

## Features

- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.
- **Comprehensive Navigation:** Includes Health Info, Community Events, Online Consultation, Health Records, Medication Reminder, Community Forum, Caregiver Info, About Us, and more.
- **User Authentication:** Registration, login, and logout with localStorage-based user management.
- **Access Control:** Only authenticated users can access protected pages; unauthenticated users are redirected to the login page.
- **Form Validation & Security:** Robust client-side validation for all forms (username, password, role, etc.) to prevent invalid or malicious input. No direct HTML rendering from user input to prevent XSS.
- **Health Records Management:** Health data entry, data list display, and placeholders for data visualization and export.
- **User Experience:** Clean, modern UI with clear navigation, English prompts, and error feedback.

## Tech Stack

- [Vue 3](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vue Router](https://router.vuejs.org/)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd elderly-health-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173/
   ```

## Project Structure

```
src/
  assets/           # Static assets
  components/       # Reusable components
  views/            # All main and subpages
  router/           # Routing configuration
  App.vue           # Main app component
  main.js           # Entry point
```

## Security

- All user input is validated on the client side.
- Authentication is required for all protected pages.
- No direct HTML rendering from user input (prevents XSS).
- See [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Prevention_Cheat_Sheet.html) for best practices.

## Limitations

- All data is stored in the browser’s localStorage; there is no backend or server-side storage.
- For demonstration and educational purposes only.

## Declaration

No AI-generated code was used in this project. ChatGPT was only used for brainstorming and problem-solving ideas, not for code generation.

## License

This project is for educational use only.

