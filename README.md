# Insulin Access Dashboard

A district-level dashboard for mapping insulin access risk by congressional district, tracking legislation, and generating constituent action items.

## Features

- **Risk Mapping**: Interactive map showing insulin access risk by congressional district
- **Legislation Tracking**: Current bills and press coverage linked to each district
- **Constituent Action**: One-page summaries of what constituents can do now
- **Data Transparency**: Scripted ETL process with cached datasets

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ia2/
├── app/                    # Next.js app directory
│   ├── api/              # API routes
│   ├── (components)/     # React components
│   ├── about/            # About page
│   ├── alerts/           # Alerts page
│   └── layout.tsx        # Root layout
├── lib/                   # Utility functions and types
├── public/                # Static assets and data
│   ├── data/             # JSON data files
│   └── geo/              # GeoJSON files
└── etl/                   # Data processing scripts
```

## Data Sources

- District boundaries from GeoJSON files
- Scoring metrics from JSON data files
- Real-time alerts from API endpoints

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet with React-Leaflet
- **Icons**: Lucide React

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
