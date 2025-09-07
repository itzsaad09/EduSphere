import React, { useState, useEffect } from "react";
import "./Home.css";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock Your Potential with{" "}
            <span className="text-highlight">EduSphere</span>
          </h1>
          <p className="hero-subtitle">
            Your comprehensive platform for learning, growth, and skill
            development. Explore courses from top instructors worldwide.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => (window.location.href = "/courses")}
            >
              Explore Courses
            </button>
            {isLoggedIn ? (
              <button className="btn-secondary" onClick={handleGoToDashboard}>
                Go to Dashboard
              </button>
            ) : (
              <button
                className="btn-secondary"
                onClick={() => (window.location.href = "/signup")}
              >
                Sign Up Now
              </button>
            )}
          </div>
        </div>
        <div className="hero-image-container">
          {/* Placeholder image for a learning illustration */}
          <img
            src="/src/assets/hero-img.png"
            alt="Dynamic Learning Environment"
            className="hero-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/1d4ed8/ffffff?text=Dynamic+Learning";
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-grid-section">
        <h2 className="section-title">Why Choose EduSphere?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Expert-Led Courses</h3>
            <p className="feature-description">
              Learn from industry leaders and passionate educators dedicated to
              your success.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">Flexible Learning</h3>
            <p className="feature-description">
              Access your courses anytime, anywhere, on any device. Learn at
              your own pace.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Track Your Progress</h3>
            <p className="feature-description">
              Monitor your learning journey with intuitive progress trackers and
              analytics.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3 className="feature-title">Vibrant Community</h3>
            <p className="feature-description">
              Connect with fellow learners, share insights, and collaborate on
              projects.
            </p>
            {/*  */}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2 className="section-title cta-title">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="cta-subtitle">
          Join EduSphere today and transform your future.
        </p>
        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/courses")}
        >
          Enroll Today
        </button>
      </section>
    </div>
  );
}

export default HomePage;
