import React from "react";
import "./Feedback.css";

function Feedback() {
  const dummyFeedback = [
    {
      id: 1,
      name: "Alice Johnson",
      rating: 5,
      comment:
        "EduSphere transformed my learning journey! The courses are well-structured, and instructors are top-notch. Highly recommend!",
      date: "2024-07-28",
    },
    {
      id: 2,
      name: "Bob Williams",
      rating: 4,
      comment:
        "Great platform with a wide variety of courses. The progress tracking is very helpful. Sometimes, the video player can be a bit slow, but overall fantastic.",
      date: "2024-07-25",
    },
    {
      id: 3,
      name: "Charlie Brown",
      rating: 5,
      comment:
        "The community features are amazing! I love connecting with other learners and sharing insights. It really makes learning more engaging.",
      date: "2024-07-20",
    },
    {
      id: 4,
      name: "Diana Green",
      rating: 5,
      comment:
        "The flexible learning options fit perfectly with my busy schedule. EduSphere truly puts students first!",
      date: "2024-07-18",
    },
    {
      id: 5,
      name: "Eve Adams",
      rating: 4,
      comment:
        "Fantastic content, although I wish there were more advanced courses in my niche. Still, a solid platform for skill development.",
      date: "2024-07-15",
    },
  ];

  const renderStars = (currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= currentRating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="feedback-page-container">
      {/* What Our Students Say Section */}
      <section className="student-testimonials-section">
        <h2 className="section-title testimonials-title">
          What Our Students Say
        </h2>
        <div className="testimonials-grid">
          {dummyFeedback.map((feedback) => (
            <div key={feedback.id} className="testimonial-card">
              <div className="testimonial-header">
                <span className="testimonial-name">{feedback.name}</span>
                <div className="testimonial-stars">
                  {renderStars(feedback.rating)}
                </div>{" "}
                {/* Stars are not clickable here */}
              </div>
              <p className="testimonial-comment">"{feedback.comment}"</p>
              <p className="testimonial-date">{feedback.date}</p>
            </div>
          ))}
        </div>
        {/* Button to navigate to feedback submission page */}
        <div className="submit-feedback-button-container">
          <button
            className="submit-feedback-btn"
            onClick={() => window.location.href = "/feedback"}
          >
            Submit Your Feedback
          </button>
        </div>
      </section>
    </div>
  );
}

export default Feedback;
