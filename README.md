# Presbyopia Analysis Dashboard

A comprehensive web application for analyzing presbyopia screening data from The Nudge's vision program. The application generates and analyzes data for 5000 Indian patients, providing insights into age-wise presbyopia incidence, diopter strength distribution, and comparisons with global averages.

## Features

- **Automatic Data Generation**: Generates realistic data for 5000 Indian patients
- **Interactive Dashboard**: Visual analytics with charts and statistics
- **Age-wise Analysis**: View presbyopia incidence across different age groups
- **Diopter Distribution**: Analyze the distribution of prescribed diopter strengths
- **Global Comparison**: Compare local data with global presbyopia averages
- **City-wise Insights**: Breakdown by major Indian cities
- **Advanced Filtering**: Filter by age, city, gender, and occupation
- **Data Export**: Download the complete dataset as CSV

## Tech Stack

- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for interactive charts
- **sql.js** for in-browser SQLite database
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd presbyopia-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Data Structure

The application generates data for each patient including:
- **Name**: Common Indian names
- **Age**: 35-75 years (presbyopia-relevant range)
- **Aadhaar ID**: 12-digit formatted IDs
- **City**: 15 major Indian cities
- **Occupation**: 20 different occupations
- **Gender**: Male/Female distribution
- **Previous Glasses**: Usage history
- **Diopter Strength**: +1.00 to +3.50 (age-correlated)

## Age Distribution

- 35-44 years: 20%
- 45-54 years: 35%
- 55-64 years: 30%
- 65-75 years: 15%

## Global Averages Reference

The dashboard compares local data against WHO global presbyopia statistics:
- Age 40-44: 50% incidence, avg +1.25D
- Age 45-49: 65% incidence, avg +1.50D
- Age 50-54: 80% incidence, avg +2.00D
- Age 55-59: 90% incidence, avg +2.25D
- Age 60+: 95% incidence, avg +2.50D

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory and can be served by any static file server.

## License

This project is created for The Nudge's vision screening program.