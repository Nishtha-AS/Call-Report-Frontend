# Call Report App – Frontend

The Call Report App is a mobile-based frontend application built for Relationship Managers (RMs) to digitally capture, manage, and submit customer visit reports in a structured and workflow-driven format.

It is designed to replace manual call reporting processes with a streamlined digital solution that enables better monitoring, validation, and communication within lending workflows.

---

## 🧩 Modules & Features

- RM login and authentication flow  
- Dashboard with customer and report overview  
- Customer listing and search functionality  
- Create and manage call reports  
- Multi-step structured form (7–8 sections)  
- Draft, submitted, and completed report tracking  
- Upload support for documents and photographs  
- Collateral visit tracking  
- Banking and stock verification inputs  
- Submission workflow to Credit Manager  

---

## 📦 Scope

This repository contains the frontend implementation of the Call Report system.

The application covers the complete lifecycle of a call report:
- Customer selection  
- Report creation  
- Multi-stage data entry  
- Validation and submission  
- Report tracking and review  

The project uses sample/mock data and does not include backend or API integrations.

---

## 🏗️ Repository Structure

Call-Report-Frontend/  
├── src/ (Application source code)  
├── public/ (Static assets)  
├── android/ (Capacitor Android build files)  
├── capacitor.config.ts  
├── package.json  
└── other configuration files  

---

## ▶️ Running the Project

Install dependencies:  
npm install  

Run the application:  
npm run dev  

Build for production:  
npm run build  

---

## 📱 Android Build

npx cap sync android  
npx cap open android  

OR build APK:

cd android  
./gradlew assembleRelease  

---

## 📱 Mobile App Screenshots

### Onboarding & Access

<p align="center">
  <img src="https://github.com/user-attachments/assets/1310dda2-da22-4446-895a-2200747edeb4" width="220"/>
  <img src="https://github.com/user-attachments/assets/05301d2e-862e-49b1-b882-1e73b6c4acd3" width="220"/>
</p>

<p align="center"><i>Splash Screen • Login</i></p>

---

### Home & Core Screens

<p align="center">
  <img src="https://github.com/user-attachments/assets/a1d2b980-c58a-44ea-a41f-d8ad3eaffd13" width="180"/>
  <img src="https://github.com/user-attachments/assets/85eb11c6-9e8c-4bb4-ad3e-91e3d99e8f8f" width="180"/>
  <img src="https://github.com/user-attachments/assets/27665f23-7775-44b4-9fa8-199aebd4bc84" width="180"/>
  <img src="https://github.com/user-attachments/assets/6a93e745-0446-4517-91f4-3af71fa109eb" width="180"/>
  <img src="https://github.com/user-attachments/assets/4cb5543c-3899-487e-9e68-4029cf813b22" width="180"/>
  <img src="https://github.com/user-attachments/assets/c4b49f1e-edf2-401b-ac66-633079688f9a" width="180"/>
  <img src="https://github.com/user-attachments/assets/bdf3fa05-8bcb-4030-b373-7b14efb4fa88" width="180"/>
  <img src="https://github.com/user-attachments/assets/e25c8c87-58fa-41e4-8c84-b586096c6983" width="180"/>
  <img src="https://github.com/user-attachments/assets/8e0f12c6-75d9-482e-a561-b5a025868c87" width="180"/>
</p>

<p align="center"><i>Home • Navigation • Reports • Customers • Filters</i></p>

---

### Call Report Form

<p align="center">
  <img src="https://github.com/user-attachments/assets/0c1375f2-af30-44d0-9248-0d26704250ba" width="180"/>
  <img src="https://github.com/user-attachments/assets/61cbc5da-74b0-4765-be0b-d6715c26ce83" width="180"/>
  <img src="https://github.com/user-attachments/assets/ca26a77e-9b0e-428f-913f-e6b6f71bd875" width="180"/>
  <img src="https://github.com/user-attachments/assets/69e32c78-4b9e-4b72-8c98-6ce50ecb0071" width="180"/>
  <img src="https://github.com/user-attachments/assets/27f1fb6c-2ede-4ee2-b0ff-69b0c756c3e7" width="180"/>
  <img src="https://github.com/user-attachments/assets/a3803246-3143-4204-9919-56483863483d" width="180"/>
  <img src="https://github.com/user-attachments/assets/70573527-835d-4323-bc7f-bf494944628e" width="180"/>
  <img src="https://github.com/user-attachments/assets/66f10380-50e6-4107-923a-45097e5b5d2f" width="180"/>
</p>

<p align="center"><i>Multi-step Call Report Form</i></p>

---

## 📌 Status

- Frontend developed  
- Workflow screens implemented  
- Prototype/demo-ready application  
- No backend integration (sample data used)  

---

## 📎 Notes

This application is designed to digitize call report processes in lending institutions, enabling structured data capture across borrower visits, operational checks, financial validation, and collateral verification.

It aligns with real-world RM workflows and supports improved monitoring, reporting accuracy, and decision-making in credit processes.
