import React, { useState } from "react";
import "./FeedbackSubmission.css";

function FeedbackSubmission() {
  const [feedbackText, setFeedbackText] = useState("");
  const [studentName, setStudentName] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();

    console.log("Feedback Submitted:", { feedbackText, studentName, rating });

    setFeedbackText("");
    setStudentName("");
    setRating(0);
    alert("Thank you for your feedback!");
  };

  const renderStars = (currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`rating-star ${i <= currentRating ? "selected" : ""}`}
          onClick={() => setRating(i)}
        >
                    ★        {" "}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="feedback-form-wrapper">
            {/* Feedback Submission Section */}     {" "}
      <section className="feedback-section">
                <h2 className="section-header">Share Your Feedback!</h2>       {" "}
        <p className="section-description">
                    We'd love to hear about your experience with EduSphere.    
             {" "}
        </p>
        <form
          onSubmit={handleSubmitFeedback}
          className="feedback-submission-form"
        >
          <div className="form-field">
                        <label htmlFor="feedback-comment">Your Comments:</label>
            <textarea
              id="feedback-comment"
              className="form-textarea-input"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What do you love? What can we improve?"
              rows="6"
              required
            ></textarea>
          </div>
          <div className="form-field">
                        <label>Overall Rating:</label>           {" "}
            <div className="rating-stars-wrapper">{renderStars(rating)}</div>   
          </div>
          <div className="form-field">
            <label htmlFor="student-name-input">Your Name (Optional):</label>   
            <input
              type="text"
              id="student-name-input"
              className="form-text-input"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g., Jane Doe"
            />
          </div>
          <div className="submit-feedback-button-container">
            <button
              className="submit-feedback-btn"
              onClick={() => (window.location.href = "/feedback")}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default FeedbackSubmission;
