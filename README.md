# Intelligent Resume Screening and Job Matching System

A comprehensive Java full-stack application that intelligently screens resumes and matches them with job requirements using advanced parsing and matching algorithms.

## Features

### Backend (Spring Boot)
- **User Management**: Role-based authentication (Candidate, Recruiter, Admin)
- **Resume Processing**: Parse PDF, DOC, DOCX, and TXT files
- **Intelligent Matching**: Advanced algorithm for matching resumes with jobs
- **REST APIs**: Complete CRUD operations for all entities
- **Security**: JWT-based authentication and authorization
- **Database**: H2 in-memory database with JPA/Hibernate

### Frontend (React)
- **Modern UI**: Built with Ant Design components
- **User Dashboard**: Role-specific dashboards and functionality
- **File Upload**: Drag-and-drop resume upload with progress tracking
- **Match Visualization**: Detailed match analysis and scoring
- **Responsive Design**: Mobile-friendly interface

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Database Operations)
- **Apache POI** (Document Processing)
- **Apache PDFBox** (PDF Processing)
- **H2 Database** (In-memory)
- **Maven** (Dependency Management)

### Frontend
- **React 18**
- **Ant Design** (UI Components)
- **React Router** (Navigation)
- **Axios** (HTTP Client)
- **JavaScript ES6+**

## Project Structure

```
CSE435_Semainer_Project/
|
|-- src/main/java/com/cse435/resumescreening/
|   |-- controller/          # REST API Controllers
|   |-- service/             # Business Logic
|   |   |-- matcher/         # Matching Algorithm
|   |   |-- parser/          # Resume Parser
|   |-- repository/          # JPA Repositories
|   |-- entity/              # Database Entities
|   |-- dto/                 # Data Transfer Objects
|   |-- security/            # Security Configuration
|   |-- ResumeScreeningApplication.java
|
|-- src/main/resources/
|   |-- application.properties
|
|-- frontend/
|   |-- src/
|   |   |-- components/      # React Components
|   |   |-- pages/           # Page Components
|   |   |-- contexts/        # React Contexts
|   |   |-- services/        # API Services
|   |-- public/
|   |-- package.json
|
|-- pom.xml
|-- README.md
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Backend Setup

1. Navigate to the project root:
```bash
cd CSE435_Semainer_Project
```

2. Build and run the Spring Boot application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Resumes
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes/my` - Get user's resumes
- `GET /api/resumes/{id}` - Get resume by ID
- `POST /api/resumes/{id}/process` - Process resume

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/my` - Get user's jobs
- `POST /api/jobs/{id}/match` - Find matches for job

### Matches
- `GET /api/matches/job/{jobId}` - Get matches for job
- `GET /api/matches/resume/{resumeId}` - Get matches for resume
- `PUT /api/matches/{id}/status` - Update match status

## User Roles

### Candidate
- Upload and manage resumes
- View job postings
- Track application status

### Recruiter
- Create and manage job postings
- Review candidate matches
- Shortlist/reject candidates

### Admin
- Full system access
- User management
- System monitoring

## Matching Algorithm

The system uses a sophisticated matching algorithm that considers:

1. **Skills Matching** (50% weight)
   - Technical skills extraction
   - Skill overlap analysis
   - Relevance scoring

2. **Experience Matching** (30% weight)
   - Years of experience
   - Role relevance
   - Industry experience

3. **Education Matching** (20% weight)
   - Degree level matching
   - Field of study relevance
   - Institution reputation

## File Processing

Supported file formats:
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Plain Text (.txt)

The parser extracts:
- Technical skills
- Work experience
- Education details
- Contact information

## Database Schema

### Tables
- **users** - User accounts and roles
- **resumes** - Resume data and metadata
- **jobs** - Job postings and requirements
- **job_matches** - Matching results and scores

## Security Features

- JWT-based authentication
- Role-based authorization
- CORS configuration
- Input validation
- SQL injection prevention

## Development

### Running Tests
```bash
# Backend tests
mvn test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## Configuration

### Backend Configuration
Edit `src/main/resources/application.properties` to configure:
- Database settings
- JWT secrets
- File upload limits
- CORS settings

### Frontend Configuration
Set environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:8080
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is for educational purposes as part of CSE435 course.

## Contact

For questions or support, please contact the development team.
