import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge">Task Management Reimagined</div>
        <h1 className="hero-title">
          Focus on what <br />
          <span className="gradient-text">matters most</span>
        </h1>
        <p className="hero-subtitle">
          TaskFlow helps you organize your work with intelligent task tracking,
          priority management, and tag-based filtering.
        </p>
        <div className="hero-cta">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Open Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">◎</div>
          <h3>Smart Prioritization</h3>
          <p>Assign high, medium, or low priority. See what needs attention first.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">◈</div>
          <h3>Tag Everything</h3>
          <p>Organize tasks with custom color-coded tags for instant filtering.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">◉</div>
          <h3>Track Progress</h3>
          <p>Move tasks from To Do → In Progress → Done with one click.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
