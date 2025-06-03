# DDMRP Course Management Platform

A modern web application for managing and displaying educational courses.

## Features

- 🏠 **Public Website**: Showcase courses to visitors
- 📝 **Inquiry System**: Allow users to express interest in courses
- 🔐 **Admin Dashboard**: Manage courses with an intuitive interface
- 📊 **Statistics**: Track and analyze course inquiries
- 📝 **Content Editor**: Create rich course descriptions
- 🖼️ **Image Upload**: Add images to courses
- 📅 **Events Management**: Create and manage events with registration tracking
- 🎟️ **Event Registration**: Allow users to register for events
- 📱 **Responsive Design**: Works on all devices
- 🗄️ **MongoDB Integration**: Persistent data storage

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ddmrp
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

The project follows the Next.js App Router structure:

- `/app`: Main application code
  - `/admin`: Admin area components and pages
  - `/api`: API routes
  - `/components`: Reusable components
  - `/courses`: Public course pages
  - `/events`: Public events pages
  - `/lib`: Utility functions and models

For more detailed information, see the [DOCUMENTATION.md](./DOCUMENTATION.md) file.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI**: [React](https://reactjs.org/) + [TailwindCSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js App Router
- Styled with TailwindCSS
- MongoDB for database storage
