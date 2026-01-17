# CabTrack - Driver Attendance Tracking

A premium, full-stack Next.js application for driver attendance tracking with location and photo verification.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (local file `tracker.db`)
- **Authentication**: JWT (Jose)
- **Animations**: Framer Motion

## Getting Started

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Application**:
   - Visit [http://localhost:3000](http://localhost:3000)

## Features

### Public
- **Landing Page**: Premium animated landing page with car visuals.
- **Login/Signup**: Secure authentication with "shake" error effects and OTP simulation (Use `1234` as OTP).

### Driver (Dashboard)
- **Mark Attendance**:
  - Opens Camera (Webcam/Mobile Cam).
  - Captures Geolocation (Latitude/Longitude).
  - Photo Preview & Retake.
- **History**: View past attendance logs with verification status.
- **Responsive Navigation**: Bottom tab bar on mobile.

### Admin (Panel)
- **Login**: Use the pre-seeded admin account.
  - **Email**: `admin@example.com`
  - **Password**: `admin123`
- **Dashboard**:
  - View all attendance logs.
  - See driver photos and locations (Google Maps link).
  - **Verify/Unverify** attendance records.

## Project Structure
- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Database and Auth utilities.
- `public/uploads/`: Stored attendance photos.
- `tracker.db`: SQLite database file.
